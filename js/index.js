const incidentsArr = new Array();

(async function(){
    apiTransporte().then(()=>{
        let incidents = document.querySelectorAll('.incident');
        incidents.forEach((incident) => {
            incident.addEventListener('click', async function(elem){
                await drawMaps(incidentsArr[elem.target.id]);
            }, false);
        });
    });
})();

class Incidents{
    constructor(title, description, location, polyline){
        this.titleIncident = title;
        this.descriptionIncident = description;
        this.locationIncident = location;
        this.polyline = polyline;    
    }

    formatPolyline(){
        this.polyline = this.polyline.split(' ');
        let aux = {};
        this.polyline.forEach((coor, index)=>{
            console.log(index);
            let latLng = index%2 == 0 ? 'lat' : 'lng';
            aux[latLng] = coor;
        })
        this.polyline = aux;
    }

    createNodes(){
        this.incident = document.createElement('div');
        this.title = document.createElement('h3');
        this.description = document.createElement('h4');
        this.location = document.createElement('p');

        this.incident.id = this.lastId();
        this.title.id = this.lastId();
        this.description.id = this.lastId();
        this.location.id = this.lastId();
    }

    lastId(){
        return incidentsArr.length;
    }
    
    /** return incident element */
    addText(){
        this.id=this.lastId();
        this.title.appendChild(document.createTextNode(this.titleIncident));
        this.description.appendChild(document.createTextNode(this.descriptionIncident));
        this.location.appendChild(document.createTextNode(this.locationIncident));

        this.incident.appendChild(this.title);
        this.incident.appendChild(this.description);
        this.incident.appendChild(this.location);

        this.incident.className = 'incident';
        this.incident.id = this.id;

        return this.incident;
    }
}

async function createIncident(titleIncident, descriptionIncident, locationIncident, polyline){
    titleIncident = titleIncident || "No Disponible";
    descriptionIncident = descriptionIncident || "No Disponible";
    locationIncident = locationIncident || "No Disponible";
    let containerIncidents = document.getElementById('incidents');

    let incident = new Incidents(titleIncident, descriptionIncident, locationIncident, polyline);
    incidentsArr.push(incident);
    incident.createNodes();
    let incidentTemplate = incident.addText();
    incident.formatPolyline();

    containerIncidents.appendChild(incidentTemplate);
}

async function drawMaps(incident){
    console.log(incident.polyline);    
}


/*get all incidents in CABA */
async function apiTransporte(){
    const uri = "/transito/v1/cortes/";
    const proxy = 'https://cors-anywhere.herokuapp.com/'
    const url = "https://apitransporte.buenosaires.gob.ar"+uri+"?formato=cifs&client_id=cb9fec7aea2d441383b169d0c8ef01d4&client_secret=e4E9a77575B049B68258cf42A1Db1f43";
   
    await fetch(proxy+url).then(response=>response.json())
    .then((dataIncidents)=>{
        dataIncidents['incidents'].map(async (incident)=>{
            await createIncident(incident['type'], incident['description'], incident['street'], incident['polyline']);
        });
    });
}
