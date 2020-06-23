const generateCard = (player) => {
    return $(`
    <div class="card" style="width: 11rem;">
        <img class="card-img-top" src="https://nhl.bamcontent.com/images/headshots/current/168x168/${player.id}.jpg" onError="this.onerror=null; this.src='./assets/img/blank.png';" alt="Player Image">
        <div class="card-body">
            <h5 class="card-title">${player.fullName}</h5>
            <select class="form-control">
                <option>Career</option>
            </select>
            <p class="card-text">
                Games: ${player.games}<br>
                Goals: ${player.goals}<br>
                Assists: ${player.assists}<br>
                Points: ${player.points}<br>
            </p>
        </div>
    </div>
`)
}

const generateOptions = () => {
    
}