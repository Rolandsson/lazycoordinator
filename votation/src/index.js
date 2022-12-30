import $ from 'jquery';
import CompleteComponent from './components/completeComponent';
import CubicleComponent from './components/cubicleComponent';
import { syncLocalVotes } from './service/localVoteStorageService';
import { sendVote, initRemoteVotes } from './service/voteService';

const appContainer = $(".app");

function initCubicles() {
    let projects = [
        {name: "Boy Scouts", url: "https://....."},
        {name: "Han solo", url: "https://....."},
        {name: "Han solo2", url: "https://....."},
    ]
    
    let parent;
    
    projects.forEach(project => {
        let cube = new CubicleComponent(project);
        cube.setVoteHandler(sendVote)
        appContainer.append(cube.renderHTML());
    
        if(parent != undefined) {
            parent.setNext(cube);
        }
        parent = cube;
    });
    
    let comlpeted = new CompleteComponent();
    appContainer.append(comlpeted.renderHTML());
    parent.setNext(comlpeted);


    comlpeted.onDisplay();
}

initRemoteVotes()
    .then(votes => {
        syncLocalVotes(votes);
        initCubicles();
    });

