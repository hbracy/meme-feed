const Pool = require('pg').Pool
const bcrypt = require('bcrypt-nodejs');
const fs = require('fs');

SALT_WORK_FACTOR = 10;

const pool = new Pool({
  user: 'me',
  host: 'localhost',
  database: 'memefeed',
  password: 'password',
  port: 5432,
});

function getAllUsers() {
    console.log("HERE");
    let getUsersQuery = {
        text: 'SELECT * FROM users'
    }
    
    return pool.query(getUsersQuery);

}

function getAllTeamMembers(Username) {
    console.log("IN NUMBER 2");
    return getUserFromUsername(Username).then(res => {
        let longQuery = {
            text: 'SELECT users.Username, users.username, users.position FROM users JOIN (SELECT * FROM team_memberships JOIN (SELECT team_memberships.team_id FROM users JOIN team_memberships ON users.id = team_memberships.user_id WHERE users.id = $1) AS firstselect ON team_memberships.team_id = firstselect.team_id) AS team_members on team_members.user_id = users.id;'
        
            // Get id from Username in users
            // Use the id to get team ids in team_memberships
            // Get the ids of team members that have the team id in team_memberships
            // Get the Usernames of the ids in users        
        
        }
        let userId = res.rows[0].id;
        let values = [userId];
        return pool.query(longQuery, values);

    }).catch(err => {
        console.log("Failed To get userId from Username");
    });
}


function getAllTeamMembers2(Username) {
    console.log("IN GET ALL TEAM MEMBERS");
    return new Promise(function (resolve, reject){
        getAllTeams(Username).then(res => {
            let teams = res.rows;
            let i;
            let allTeamMembers = [];
            for (i = 0; i < teams.length; i++) {
                let teamId = res.rows[i].team_id;
                getTeamMembers(teamId).then(res => {
                    let teamMemberRows = res.rows;
//                    console.log("TEAM MEMBERS: " + teamMemberRows);''
                    let teamMembers = [];
                    let j;
//                    console.log("LENGTH: " + teamMemberRows.length);
                    for (j = 0; j < teamMemberRows.length; j++) {
                        let userId = teamMemberRows[j].user_id;
                        console.log(userId);
                        getUserFromId(userId).then(res => {
                            
                            let user = res.rows[0];
//                            console.log("USER: " + JSON.stringify(user));

                            teamMembers.push(user);
                        }).catch(err => {
                            reject(err);
                            console.log(err);
                        });
                    }
                    allTeamMembers.push(teamMembers);
                }).catch(err => {
                    reject(err);
                    console.log(err);
                });
            }
            resolve(allTeamMembers);
        }).catch(err => {
            reject(err);
            console.log(err);
        });
    });
}

function getUserFromId(userId) {
    console.log("HERE");
    let getUserQuery = {
        text: 'SELECT * FROM users WHERE id = $1;'
    }
    
    let values = [userId];
    return pool.query(getUserQuery, values);
}

function getTeamMembers(teamId) {
    console.log("TEAM ID " + teamId);
    let getTeamMembersQuery = {
        text: 'SELECT * FROM team_memberships WHERE team_id = $1;'
    }
    let values = [teamId];
    return pool.query(getTeamMembersQuery, values);
}

function getAllTeams(Username) {
    return getUserFromUsername(Username).then(res => {
        let userId = res.rows[0].id;
        let getTeamsQuery = {
            text: 'SELECT * FROM team_memberships WHERE user_id = $1;'
        }
        let values = [userId];
        return pool.query(getTeamsQuery, values);
    }).catch(err => {
        console.log(err);
    });
}

function createNewTeam(Username, teamName) {
    return getUserFromUsername(Username).then(res => {
        let userId = res.rows[0].id;
        let createTeamQuery = {
            text: 'INSERT INTO teams (name) VALUES ($1) RETURNING id;'
        }
        let createTeamValues = ['Super Badass Team 2'];
        return pool.query(createTeamQuery, createTeamValues).then(res => {
            let teamId = res.rows[0].id;
            return addUserToTeam(userId, teamId);
        }).catch(err => {
            console.log(err);
        }); 
        
    }).catch(err => {
        console.log(err);
    })
}

function addUserToTeam(userId, teamId) {
    let createTeamMembershipQuery = {
        text: 'INSERT INTO team_memberships (user_id, team_id) VALUES ($1, $2) RETURNING *;'
    }
    let createTeamMembershipValues = [userId, teamId];
    return pool.query(createTeamMembershipQuery, createTeamMembershipValues);
}

function getUserFromUsername(Username) {
    let query = {
        text: 'SELECT * FROM users WHERE Username = $1;'
    }
    let values = [Username];
    return pool.query(query, values);
}

function validateUsernameAndPassword(username, candidatePassword) {
    // A promise, it uses the User object from user-schema to login a user
    let query = {
        text: 'SELECT * FROM users WHERE username = $1;'
    }
    let values = [username];
    return pool.query(query, values).then(results => {
        let user = results.rows[0];
        return new Promise(function(resolve, reject) {
            bcrypt.compare(candidatePassword, user.password, function(err, res) {
                if (err) {
                    console.log(err);
                    reject();
                }
                if (res) {
                    console.log("VALIDATION SUCCESSFUL");
                    resolve(user);
                } else {
                    console.log("VALIDATION UNSUCCESSFUL");
                    reject();
                }
            });
            
        });
    }).catch(err => {
        console.log(err);
        console.log("NO SUCH USERNAME");
    });
    
}


function signUpUser(username, password) {
    let passwordPromise = encryptString(password);
    return passwordPromise.then(newPassword => {
        let query = {
            text: 'INSERT INTO users (username, password) VALUES ($1, $2);'
        }

        let values = [username, newPassword];
        return pool.query(query, values);
    }).catch(err => {
      console.log(err.stack);
      console.log("SIGNUP FAILED");
    })

}

function getAllMembers() {
  let query = {
    text: 'SELECT * FROM members ORDER BY id ASC;',
//    rowMode: 'array'
  };
  
  return pool.query(query).then(results => {
      members = results.rows;
//      console.log("QUERY RESULT: " + JSON.stringify(members));
      return members;
    }
  ).catch(
    
  )
  
}

function getMemberByUsername(Username) {
  let member = null;
  pool.query('SELECT * FROM members WHERE Username = $1', [Username], (error, results) => {
    if (error) {
      throw error
    }
    member = results.rows;
  });
  return member;
}

function updateMemeVisibility(userId, memeId) {
  let query = {
    text: 'INSERT INTO user_meme (user_id, meme_id) VALUES ($1, $2) ON CONFLICT (user_id, meme_id) DO NOTHING;'
  }
  let values = [userId, memeId];
  return pool.query(query, values);
  
}

function getTopMemes(username) {
  
  let longQuery = {
//    text: 'SELECT memes.file_name, users.username, users.position FROM users JOIN (SELECT * FROM team_memberships JOIN (SELECT team_memberships.team_id FROM users JOIN team_memberships ON users.id = team_memberships.user_id WHERE users.id = $1) AS firstselect ON team_memberships.team_id = firstselect.team_id) AS team_members on team_members.user_id = users.id;'
    text: 'SELECT * FROM memes WHERE memes.id NOT IN (SELECT meme_id FROM user_meme JOIN (SELECT * FROM users WHERE username = $1) AS userId ON userId.id = user_meme.user_id)'

  // Get id from Username in users
  // Use the id to get team ids in team_memberships
  // Get the ids of team members that have the team id in team_memberships
  // Get the Usernames of the ids in users        

  }
  
  let values = [username];
  return pool.query(longQuery, values)

  
}

function insertMemeFileNames() {
  let rootFilePath = '/memes-root/new1/memes/';
  fs.readdir(__dirname + rootFilePath, (err, fileNames) => {
      // Ignore hidden files in the directory
      fileNames = fileNames.filter(item => !(/(^|\/)\.[^\/\.]/g).test(item));
      for (let i = 0; i < fileNames.length; i++) {
          let fileName = fileNames[i];
          let newFileName = '/memes-root/new1/memes/' + fileName;
          insertMemeFileName(newFileName);
        
          
      }
    
  });
  //    res.sendFile(__dirname + '/memes/Fr_though.jpg');


  
  
}

function insertMemeUser(userId, memeId) {
  let query = {
    text: 'INSERT INTO user_meme (user_id, meme_id, owner, liked) VALUES ($1, $2, $3, $4);'
  }

  let values = [userId, memeId, true, true];
  return pool.query(query, values);

}


function insertMemeFileName(fileName) {
  let query = {
    text: 'INSERT INTO memes (file_name) VALUES ($1);'
  }

  let values = [fileName];
  return pool.query(query, values);

}


function encryptString(str) {
    // generate a salt
    return new Promise(function(resolve, reject) {
        bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
            if (err) reject(err);
            // hash the password using our new salt
            bcrypt.hash(str, salt, null, function(err, hash) {
                // override the cleartext password with the hashed one
                if (err) reject(err);
                str = hash;
                resolve(str);
            });
        });
    });

}





module.exports = {
  getAllUsers,
  getAllMembers,
  getMemberByUsername,
  signUpUser,
  validateUsernameAndPassword,
  encryptString,
  createNewTeam,
  getUserFromUsername,
  addUserToTeam,
  getTeamMembers,
  getAllTeamMembers,
  insertMemeFileNames,
  insertMemeUser,
  getTopMemes,
  updateMemeVisibility
}