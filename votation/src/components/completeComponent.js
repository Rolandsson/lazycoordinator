import { getVotes } from "../service/localVoteStorageService";

export default class CompleteComponent {

    onDisplay() {
        this.el.find(".votes").html(this.renderVotes())
    }

    translateNumericVote(vote) {
        return ["Not selected", "Good", "Very good", "Awesome"][vote];
    }

    renderVotes() {
        let html = ""
        let votes = getVotes();
        Object.keys(votes).forEach(key => {
            if(key != undefined) {
                html += `
                <div>
                    <h3>${key}</h3>
                    <p>UX vote: ${this.translateNumericVote(votes[key].ux)}</p>
                    <p>Theme vote: ${this.translateNumericVote(votes[key].theme)}</p>
                </div>
                `   
            }
        });
        return html;
    }

    renderHTML() {
        this.el = $(`
            <div class="completed-screen">
                <div class="container">
                    <h2>All done, you may exit the site</h2>
                    <div class="votes"></div>
                </div> 
            <div>
        `);

        return this.el;
    }
}