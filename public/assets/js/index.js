// Obtain data from json file
let data;
let addedPlayers = [];
let sort = "goals";
const getData = () => {
  return $.ajax({
    url: "/api",
    method: "GET",
  }).then(res => {
    data = res;
  });
}
getData();

const updateSearches = (index) => {
  $.ajax({
    url: "/api/players",
    data: {
      "index": index,
    },
    method: "POST"
  })
}

// Search filter
const searchBar = $("#search-bar");
const searchList = $("#search-list");
searchBar.keyup(() => {
  searchList.html("")
  let query = searchBar.val().trim().toLowerCase();
  let results = [];
  console.log(query);
  // Filter players
  for (let i = 0; i < data.players.length; i++) {
    const player = data.players[i];
    if (player.fullName.toLowerCase().includes(query)) {
      results.push({
        name: player.fullName,
        image: `https://nhl.bamcontent.com/images/headshots/current/168x168/${player.id}.jpg`,
        searches: player.searches,
        index: i
      });
    }
  }
  // Filter teams
  // for (let i = 0; i < data.teams.length; i++) {
  //   const team = data.teams[i];
  //   if (team.name.toLowerCase().includes(query)) {
  //     results.push({
  //       name: team.name,
  //       image: `https://www-league.nhlstatic.com/images/logos/teams-current-primary-light/${team.id}.svg`,
  //       searches: team.searches
  //     });
  //   }
  // }
  // sort results by goals
  results.sort(sortBy("searches", "desc"))
  // list results
  if (searchBar.val().trim().toLowerCase()) {
    let num;
    if (results.length > 5) {
      num = 5;
    } else {
      num = results.length;
    }
    for (let i = 0; i < num; i++) {
      const result = results[i];
      searchList.append(`<a href="#"><li class="list-group-item result" data-index="${result.index}"><img class="mr-3" src="${result.image}" onError="this.onerror=null; this.src='./assets/img/blank.png';" width="60" height="60" />${result.name}</li></a>`);
    }
  }
  $(".result").click((event) => {
    const index = $(event.target).data("index");
    searchBar.val("");
    searchList.html("");
    updateSearches(index);
    addedPlayers.push({
      index: index,
      id: data.players[index].id,
      fullName: data.players[index].fullName,
      games: data.players[index].stats.games.career,
      goals: data.players[index].stats.goals.career,
      assists: data.players[index].stats.assists.career,
      points: data.players[index].stats.points.career,
    });
    sortCards();
  });
  console.log(results);
});

const newCard = (index) => {
  const card = generateCard(index);
  console.log(card);
  $("#card-container").append(card);
};

const renderCards = () => {
  $("#card-container").html("");
  for (let i = 0; i < addedPlayers.length; i++) {
    const player = addedPlayers[i];
    newCard(player);
  }
};

const sortCards = () => {
  addedPlayers.sort(sortBy(sort, "desc"));
  console.log(addedPlayers);
  renderCards();
};

// When the sort option is changed
$("#sortBy").change(() => {
  sort = $("#sortBy").val().toLowerCase();
  console.log(sort);
  sortCards();
})

// When the clear button is pressed 
$("#clearBtn").click(() => {
  addedPlayers = [];
  sortCards();
})
