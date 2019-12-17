

// Ask the cache for account info. If there's nothing in the cache, return false
export function getAccountInfo() {
    let accountInfo = localStorage.getItem('accountInfo');
    if (!accountInfo) {
        return false;
    }
    accountInfo = atob(accountInfo);

    accountInfo = JSON.parse(accountInfo);
//      console.log(accountInfo);

    return accountInfo;
}

// Store the info into the cache
export function saveAccountInfo(accountInfo) {
  accountInfo = JSON.stringify(accountInfo);
  accountInfo = btoa(accountInfo); // For security purposes
  localStorage.setItem('accountInfo', accountInfo);
}

