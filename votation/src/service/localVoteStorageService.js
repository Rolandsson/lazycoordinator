export function hasVoted(name) {
    let votes = getVotes();
    return votes[name] != undefined;
}

export function saveVote(name, query) {
    let votes = getVotes();
    votes[name] = query;
    localStorage.setItem(`votes`, JSON.stringify(votes));
}

export function getVotes() {
    return JSON.parse(localStorage.getItem("votes")) || {};
}

export function syncLocalVotes(votes) {
    localStorage.setItem(`votes`, JSON.stringify(votes));
}