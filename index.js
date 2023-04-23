class Party {
    constructor(name){
        this.name = name;
        this.partyMember = [];
    }

    addPartyMember(name, job, attack, defence, health){
        this.partyMember.push(new PartyMember(name, job, attack, defence, health));
    }
}

class PartyMember{
    constructor(name, job, attack, defence, health){
        this.name = name;
        this.job = job;
        this.attack = attack;
        this.defence = defence;
        this.health = health;     
    }
}

class Fighter extends PartyMember {
    constructor(name) {
        super(name, 'Fighter', 5, 10, 100);
    }
}

class Mage extends PartyMember {
    constructor(name) {
        super(name, 'Mage', 15, 5, 50);
    }
}

class PartyManager {
    //url to my mock api
    static url = 'https://6441f8e733997d3ef905d6ee.mockapi.io/Full_Crud_API/party';

    static getAllParties(){
        return $.get(this.url);
    }

    static getParty(id) {
        return $.get(this.url + `/${id}`);
    }

    static createParty(party) {
        return $.post(this.url, party);
    }

    static updateParty(party) {
        return $.ajax({
            url: this.url + `/${party._id}`,
            data: JSON.stringify(party),
            contentType: 'application/json',
            type: 'PUT'
        });
    }

    static deleteParty(id) {
        return $.ajax({
            url: this.url + `/${id}`,
            type: 'DELETE'
        });
    }
}

class DOMManager {
    static parties = [];

    static getAllParties(){
        PartyManager.getAllParties().then(parties => this.render(parties))
    }

//TODO


    //del party
    static deleteParty(id) {
        PartyManager.deleteParty(id)
            .then(() => {
                return PartyManager.getAllParties();
        })
        .then((parties) => this.render(parties));
    }
    
    //add part member
    static addPartyMember(id){
        for (let party of this.parties){
            if(party._id == id){
                party.partyMembers.push(new PartyMember(
                    $(`#${party._id}-party-member-name`).val(), 
                    $(`#${party._id}-party-member-job`).val(), 
                    $(`#${party._id}-party-member-attack`).val(),
                    $(`#${party._id}-party-member-defence`).val(),
                    $(`#${party._id}-party-member-health`).val()));
                PartyManager.updateParty(party)
                    .then(() => {
                        return PartyManager.getAllParties();
                    })
                    .then((parties) => this.render(parties))
            }
        }
    }
    //del part member
    static deletePartyMember(partyId, partyMemberId){
        for (let party of this.parties){
            if (party._id == partyId){
                for (let partyMember of party.partyMembers){
                    if (partyMember._id == partyMemberId){
                        party.partyMembers.splice(party.partyMembers.indexOf(partyMember), 1);
                        PartyManager.updateParty(party)
                            .then(() => {
                                return PartyManager.getAllParties();
                            })
                            .then((parties) => this.render(parties));
                    }
                }
            }
        }
    }


    //create party
    static createParty(name){
        PartyManager.createParty(new Party(name))
            .then(() => {
                return PartyManager.getAllParties();
            })
            .then((parties) => this.render(parties));
    }
    static render(parties) {
        this.parties = parties
        $('#app').empty();
        for (let party of parties) {
            $('#app').prepend(
                `<div id="${party._id}" class ="card">
                    <div class="card-header">
                        <h2>${party.name}</h2>
                        <button class="btn btn-danger" onclick="DOMManager.deleteParty('${party._id}')">Delete</button>
                    </div>
                    <div class="card-body">
                            <div class="card">
                                <div class="row">
                                    <div class="col-sm">
                                        <input type="text" id="${party._id}-party-member-name" class="form-control" placeholder="Party Member Name">
                                    </div>
                                    <div class="col-sm">
                                        <select id="${party._id}-party-member-job" class="form-select" aria-label="Choose your party members job">
                                            <option selected>Choose a job!</option>
                                            <option value="1">Fighter</option>
                                            <option value="2">Mage</option>
                                        </select>
                                    </div>
                                </div>
                                <button id="${party._id}-new-party-member" onclick="DOMManager.addPartyMember('${party._id}')" class="btn btn-primary form-control">Add</button>
                            </div>
                        </div>
                </div><br>`
            );
        for (let partyMember of party.partyMembers){
            $(`#${party._id}`).find('.card-body').append(
                `<p>
                    <span id="name-${partyMember._id}"><strong>Name: </strong> ${partyMember.name}</span>
                    <span id="job-${partyMember._id}"><strong>job: </strong> ${partyMember.job}</span>
                    <span id="attack-${partyMember._id}"><strong>attack: </strong> ${partyMember.attack}</span>
                    <span id="defence-${partyMember._id}"><strong>defence: </strong> ${partyMember.defence}</span>
                    <span id="health-${partyMember._id}"><strong>health: </strong> ${partyMember.health}</span>
                    <button class="btn btn-danger" onclick="DOMManager.deletePartyMember('${party._id}', '${partyMember._id}')">Delete Party Member</button>
                </p>`
            );
        }
        }
    }
    
}

$('#create-new-party').click(() => {
    const newPartyName = $('#new-party-name').val();
    DOMManager.createParty(newPartyName);
    $('#new-party-name').val('');
});

DOMManager.getAllParties();