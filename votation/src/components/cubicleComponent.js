import { hasVoted, saveVote } from "../service/localVoteStorageService";

export default class CubicleComponent {
    constructor(project) {
        this.name = project.name;
        this.url = project.url;
        this.uxValue = 0;
        this.themeValue = 0;
    }

    onDisplay() {

    }

    setVoteHandler(voteHandler) {
        this.voteHandler = voteHandler;
    }

    validateField(field, critera) {
        if(field.val() == "" || !critera(Number(field.val())) ) {
            let errLbl = field.parent().find(".error-msg");
            field.addClass("error-field");
            errLbl.css("visibility", "visible")
            
            setTimeout(() => {
                errLbl.css("visibility", "hidden")
                field.removeClass("error-field");
            }, 2000);
            return false;
        }

        return true;
    }

    setNext(nextProject) {
        this.next = nextProject;
    }


    handleSubmit(event) {
        let button = $(event.currentTarget).find(".button")
        if(button[0] != event.target) return false;

        if(button.hasClass("next-button")) {
            this.next.el[0].scrollIntoView({behavior: "smooth", block: "center", inline: "center"});
            return false;
        }
        

        let uxField = $(event.currentTarget).find(".ux-field");
        let themeField = $(event.currentTarget).find(".theme-field");

        if(!this.validateField(uxField, val => val > 0 && val < 4)) return false;
        if(!this.validateField(themeField, val => val > 0 && val < 4)) return false;

        let query = {ux: uxField.val(), theme: themeField.val()}
        this.voteHandler(this.name, query)
            .then(() => {
                console.log("test");
                saveVote(this.name, query)
                this.next.el[0].scrollIntoView({behavior: "smooth", block: "center", inline: "center"});
                this.next.onDisplay()
            });
    }

    renderHTML() {
        this.el = $(`
            <div class="cubicle">
                <div class="content">
                    <h2>${this.name}</h2>
                    <a href="${this.url}">${this.name}'s awesome todo app</a>
                    <div>
                        <iframe src="${this.url}" allowfullscreen="true"></iframe>
                    </div>
                    <div>
                        <label>User friendly&nbsp;</label>
                        <select class="ux-field">
                            <option value=0>-Select a value-</option>
                            <option value=1>Good</option>
                            <option value=2>Very good</option>
                            <option value=3>Awesome</option>
                        </select>
                        <label class="error-msg">You must select one</label>
                    </div>
                    <div>
                        <label>Theme score</label>
                        <select class="theme-field">
                            <option value=0>-Select a value-</option>
                            <option value=1>Good</option>
                            <option value=2>Very good</option>
                            <option value=3>Awesome</option>
                        </select>
                    </div>
                    ${hasVoted(this.name) ? "<button class='button next-button'>Already voted - Click to proceed</button>" : "<button class='button submit-button'>Submit</button>"}
                </div>
            </div>
            `
        );

        if(this.voteHandler != undefined) {
            this.el.on("click", this.handleSubmit.bind(this));
        }

        return this.el;
    }
}