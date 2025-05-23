


export function createPageUrl(pageName: string) {
    return '/' + pageName.toLowerCase().replace(/ /g, '-');
}

export function userLogout() {
    localStorage.clear();
    window.location.href = '/login';
}