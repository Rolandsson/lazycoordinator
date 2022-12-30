export function sendVote(target, vote) {
    return new Promise((resolve, reject) => {
        let data = {target: target, vote: vote};
        $.post(`http://192.168.50.125:8080/vote`, data)
        .done(resolve)
    });
}

export function initRemoteVotes() {
    return new Promise((resolve, reject) => {
        $.get("http://192.168.50.125:8080/")
        .done(resolve);
    });
}