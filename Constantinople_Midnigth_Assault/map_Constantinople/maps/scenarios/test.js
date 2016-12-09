/*
 * This is the Script containing all the Triggers for the "Survival of the Fittest" Map.
 */ 

var spawnFlag = [false, false, false, false, false, false, false, false];
				 
var waveCount = 0;
var resourceLoopCount = 0;

var firstWaveTime = 0.02; //Time in minutes when the first wave will start
var waveInterval = 0.02; //Time in minutes when waves will spawn, after the first one

//These are the templates of the attacking units, sorted by type
var waveAttackers = {
	champion: [
							   "units/athen_champion_infantry",
							   "units/athen_champion_marine",
							   "units/athen_champion_ranged",
							   "units/brit_champion_cavalry",
							   "units/brit_champion_infantry",
							   "units/cart_champion_cavalry",
							   "units/cart_champion_infantry",
							   "units/cart_champion_pikeman",
							   "units/gaul_champion_cavalry",
							   "units/gaul_champion_fanatic",
							   "units/gaul_champion_infantry",
							   "units/iber_champion_cavalry",
							   "units/iber_champion_infantry",
							   "units/mace_champion_cavalry",
							   "units/mace_champion_infantry_a",
							   "units/mace_champion_infantry_e",
							   "units/maur_champion_chariot",
							   "units/maur_champion_infantry",
							   "units/maur_champion_maiden",
							   "units/maur_champion_maiden_archer",
							   "units/pers_champion_cavalry",
							   "units/pers_champion_infantry",
							   "units/ptol_champion_cavalry",
							   "units/rome_champion_cavalry",
							   "units/rome_champion_infantry",
							   "units/sele_champion_cavalry",
							   "units/sele_champion_chariot",
							   "units/sele_champion_infantry_pikeman",
							   "units/sele_champion_infantry_swordsman",
							   "units/spart_champion_infantry_pike",
							   "units/spart_champion_infantry_spear",
							   "units/spart_champion_infantry_sword",
							   "units/celt_fanatic"
			  ],

	elephant: [
								"units/cart_champion_elephant",
								"units/maur_champion_elephant",
								"units/ptol_champion_elephant",
								"units/sele_champion_elephant"
			  ],
	siege:    [
								"units/pers_mechanical_siege_ram",
								"units/rome_mechanical_siege_ram",
								"units/spart_mechanical_siege_ram",
								"units/mace_mechanical_siege_ram",
								"units/iber_mechanical_siege_ram",
								"units/gaul_mechanical_siege_ram",
								"units/celt_mechanical_siege_ram",
								"units/brit_mechanical_siege_ram"
			  ],
	infantry: [
								"units/pers_infantry_archer_e",
								"units/hele_infantry_slinger_e",
								"units/gaul_infantry_spearman_e",
								"units/cart_infantry_swordsman_e",
								"units/rome_infantry_spearman_e",
								"units/ptol_infantry_slinger_e",
								"units/cart_infantry_swordsman_e"
			  ],
	healer:   [
								"units/athen_support_healer_e",
								"units/brit_support_healer_e",
								"units/gaul_support_healer_e",
								"units/iber_support_healer_e",
								"units/pers_support_healer_e"
			  ],
	hero:     [
								"units/rome_hero_maximus",
								"units/sele_hero_antiochus_great",
								"units/spart_hero_leonidas",
								"units/brit_hero_caratacos",
								"units/cart_hero_maharbal",
								"units/gaul_hero_britomartus",
								"units/hele_hero_themistocles",
								"units/iber_hero_caros"
			  ]
};

Trigger.prototype.StartAnEnemyWave = function()
{
	waveCount++;
	
	var cmpTimer = Engine.QueryInterface(SYSTEM_ENTITY, IID_Timer);
	
	/*
	 * Determine the number of Attackers and their Entity 
	 */
	
	var infantryCount = waveCount * 2;
	var championCount = waveCount;
	
	if(waveCount === 1) //special conditions for the first wave
	{
		infantryCount = 6;
		championCount = 0;
	}
	
	var elephantCount = Math.floor(waveCount/4);
	var siegeCount = 0;
	var healerCount = 0;
	var heroCount = 0;
	
	if(waveCount < 5 && elephantCount > 0)
	{
		elephantCount = 0;
		infantryCount++;
		championCount++;
		healerCount++;
	}

	if(elephantCount >= 1)
	{
		infantryCount = infantryCount - elephantCount * 3;
		championCount = championCount - elephantCount;
	}
	
	if(waveCount > 8)
	{
		siegeCount = 1;
		healerCount = Math.floor(waveCount/4);
	}

	if(waveCount > 11)
	{
		elephantCount = Math.floor(waveCount/3);
		infantryCount = 5;
		siegeCount = Math.floor(waveCount/5) - 1;
	}
	
	if(waveCount > 13)
	{
		infantryCount = 10;
		heroCount = 1;
	}
	
	var infantryEntity = waveAttackers.infantry[Math.floor(Math.random() * waveAttackers.infantry.length)];
	var championEntity = waveAttackers.champion[Math.floor(Math.random() * waveAttackers.champion.length)];
	var siegeEntity = waveAttackers.siege[Math.floor(Math.random() * waveAttackers.siege.length)];
	var elephantEntity = waveAttackers.elephant[Math.floor(Math.random() * waveAttackers.elephant.length)];
	var healerEntity = waveAttackers.healer[Math.floor(Math.random() * waveAttackers.healer.length)];
	var heroEntity = waveAttackers.hero[Math.floor(Math.random() * waveAttackers.hero.length)];

	// spawn attackers
	
	var multipleAttackers = [];
	var helper;
	
	if(infantryCount > 0) {
		helper =  TriggerHelper.SpawnUnitsFromTriggerPoints("A", infantryEntity, infantryCount, 0);
		multipleAttackers.push(helper);
	}
	if(championCount > 0) {
		helper =  TriggerHelper.SpawnUnitsFromTriggerPoints("A", championEntity, championCount, 0);
		multipleAttackers.push(helper);
	}
	if(siegeCount > 0) {
		helper =  TriggerHelper.SpawnUnitsFromTriggerPoints("A", siegeEntity, siegeCount, 0);
		multipleAttackers.push(helper);	}
	if(elephantCount > 0) {
		helper =  TriggerHelper.SpawnUnitsFromTriggerPoints("A", elephantEntity, elephantCount, 0);
		multipleAttackers.push(helper);
	}
	if(healerCount > 0) {
		helper =  TriggerHelper.SpawnUnitsFromTriggerPoints("A", healerEntity, healerCount, 0);
		multipleAttackers.push(helper);
	}
	if(heroCount > 0) {
		helper =  TriggerHelper.SpawnUnitsFromTriggerPoints("A", heroEntity, heroCount, 0);
		multipleAttackers.push(helper);
	}
	
	//order Attackers to attack
	
	var attackers;
	
	for(var i in multipleAttackers)
	{
		attackers = multipleAttackers[i];
		for (var origin in attackers)
		{
			var cmpPlayer = QueryOwnerInterface(+origin, IID_Player);
			if(spawnFlag[cmpPlayer.GetPlayerID()] == false)
			{
				//remove the units again
				continue;
			}
			if(!cmpPlayer)
			{
				error("Player cannot be determined, so the wave is silently retreating");
				continue;
			}
			if (cmpPlayer.GetState() != "active")
				continue;

			var cmpPosition =  Engine.QueryInterface(this.playerCivicCenter[cmpPlayer.GetPlayerID()], IID_Position);
			// this shouldn't happen if the player is still active
			if (!cmpPosition || !cmpPosition.IsInWorld)
				continue;

			// store the x and z coordinates in the command
			var cmd = cmpPosition.GetPosition();
			cmd.type = "attack-walk";
			cmd.entities = attackers[origin];
			cmd.queued = true;
			cmd.targetClasses = undefined;
			// send the attack-walk command
			ProcessCommand(0, cmd);
		}
	}

	this.TalkToPlayers({ situation: "waveIncoming", argument: false });
	cmpTrigger.DoAfterDelay(waveInterval * 60 * 1000, "StartAnEnemyWave", {});
}

/*
 * Try to mark inactive players by tracking the number of entities they own.
 * An unassigned Player will never produce a new entity.
 * This will stop running once all players have been marked.
 * So, when checking cmpTrigger.playerTrack[playerID].unassigned, you must always check if cmpTrigger.playerTrack[playerID] exists.
 * 
 * For each player marked as Unassigned, less treasures will spawn.
 */
Trigger.prototype.MarkUnassignedPlayers = function(data)
{
	if(!data || !data.playerID)
	{
		warn("no information provided to player tracker");
		return;
	}
	if(!cmpTrigger.playerTrack[data.playerID])
	{
		cmpTrigger.playerTrack[data.playerID] = {};
		cmpTrigger.playerTrack[data.playerID].eCount = data.eCount;
		cmpTrigger.playerTrack[data.playerID].unassigned = false;
		cmpTrigger.playerTrack[data.playerID].loop = 1;
	}
	else
	{
		cmpTrigger.playerTrack[data.playerID].loop++;
		
		var cmpRangeManager = Engine.QueryInterface(SYSTEM_ENTITY, IID_RangeManager);
		var playerEntities = cmpRangeManager.GetEntitiesByPlayer(data.playerID);
		var eCount = 0;
		
		for each( var entity in playerEntities)
		{
			eCount++;
		}
		
		if(eCount > cmpTrigger.playerTrack[data.playerID].eCount)
		{
			//the player must have produced something, so being for real. Exit the loop.
			return;
		}
		cmpTrigger.playerTrack[data.playerID].eCount = eCount;
		
		if(cmpTrigger.playerTrack[data.playerID].loop > 5)
		{
			cmpTrigger.playerTrack[data.playerID].unassigned = true; //so long created nothing, must be placeholder
			return;
		}
	}
	cmpTrigger.DoAfterDelay(0.95 * 60 * 1000, "MarkUnassignedPlayers", { playerID: data.playerID });
}

/*
 * The main init function, called at the start
 */

Trigger.prototype.InitGame = function()
{
	var numberOfPlayers = TriggerHelper.GetNumberOfPlayers();

	// Find all of the civic centers and females, disable some structures, setup activity watch
	for (var i = 1; i < numberOfPlayers; ++i)
	{
		/*//At first, determine how many players are actually playing (humans)
		var cmpPlayer = TriggerHelper.GetPlayerComponent(i);
		warn(cmpPlayer.GetState());*/
		
		//now handle the other stuff
		var cmpRangeManager = Engine.QueryInterface(SYSTEM_ENTITY, IID_RangeManager);
	
		var playerEntities = cmpRangeManager.GetEntitiesByPlayer(i); // Get all of each player's entities
		var eCount = 0;
		
		for each (var entity in playerEntities)
		{
			eCount++;
			if (TriggerHelper.EntityHasClass(entity, "CivilCentre"))
			{
				cmpTrigger.playerCivicCenter[i] = entity;
			}
			if (TriggerHelper.EntityHasClass(entity, "Female"))
			{
				cmpTrigger.females[i] =  entity;
			}
		}
		this.MarkUnassignedPlayers( { eCount: eCount, playerID: i } );
	}

	// Fix alliances
	/* Until we can do something about limiting the victory conditions available for this map to "None"
	for (var i = 1; i < numberOfPlayers; ++i)
	{
		var cmpPlayer = TriggerHelper.GetPlayerComponent(i);
		for (var j = 1; j < numberOfPlayers; ++j)
			if (i != j) 
				cmpPlayer.SetAlly(j);
		cmpPlayer.SetLockTeams(true);
	}*/
	
	// Make gaia black
	TriggerHelper.GetPlayerComponent(0).SetColour(0, 0, 0);
	
	// Disable farms, civic centers, corrals and walls for all players 
 	for (var i = 1; i < numberOfPlayers; ++i) 
 	{ 
		var cmpPlayer = TriggerHelper.GetPlayerComponent(i); 
		var civ = cmpPlayer.GetCiv(); 
		var disabledTemplates = {} 
		spawnFlag[cmpPlayer.GetPlayerID()] = true;
		disabledTemplates["structures/" + civ + "_field"] = true; 
		disabledTemplates["structures/" + civ + "_civil_centre"] = true; 
		disabledTemplates["structures/" + civ + "_wallset_stone"] = true;
		disabledTemplates["structures/" + civ + "_corral"] = true; 
		disabledTemplates["other/wallset_palisade"] = true;
		cmpPlayer.SetDisabledTemplates(disabledTemplates); 
 	} 
 	// Place the treasures
	this.PlaceTreasures();
}

/*
 * This places one treasure at the given point.
 * The location is in a random area around that point (circle).
 * It can be up to 31 units away. 
 */





Trigger.prototype.InitializeEnemyWaves = function()
{
	/*
	 * This function starts the timer for the waves 
	 */
	this.TalkToPlayers({situation: "beginGame", argument: firstWaveTime * 60 * 1000});
	cmpTrigger.DoAfterDelay(firstWaveTime * 60 * 1000, "StartAnEnemyWave", {});
	cmpTrigger.DoAfterDelay(firstWaveTime * 60 * 1000 - 1 * 60 * 1000, "TalkToPlayers", { situation: "beforeStart", argument: 1 * 60 * 1000 });
}

var TimeString = function(data)
{
	if(!data.time)
	{
		warn("No time provided in TimeString");
		return "";
	}
	var displayTime = data.time/60000;
	var grammar = "";
	if(data.time/60000 > 1)
	{
		grammar = "minutes";
	} else if(data.time/1000 < 60)
	{
		grammar = "seconds"
		displayTime = data.time/1000;
	} else if(data.time/60000 == 1)
	{
		grammar = "minute";
	} else if(data.time/1000 == 1)
	{
		grammar = "second";
		displayTime = data.time/1000;
	}
	return displayTime + " " + grammar;
}

/* 
 * TalkToPlayers: Keep the active players up to date about whats happening. This is called from inside the other functions.
 * "data" mut be an object which contains string "situation", and any "argument" properties. "argument" is optional. 
*/

Trigger.prototype.TalkToPlayers = function(data)
{
	if(!data || !data.situation)
	{
		error("Nothing to talk :-(");
		return;
	}
	
	var cmpGUIInterface = Engine.QueryInterface(SYSTEM_ENTITY, IID_GuiInterface);
	var players = [];
	var numberOfPlayers = TriggerHelper.GetNumberOfPlayers();
	
	//only deliver messages to active players (not e.g. dead)
	for (var i = 1; i < numberOfPlayers; ++i)
	{
		if (TriggerHelper.GetPlayerComponent(i).GetState() == "active")
		{	
			players.push(i);
		}
	}
	
	switch (data.situation)
	{
		case "beginGame":
			cmpGUIInterface.PushNotification({
				"players": players, 
				"message": markForTranslation("Welcome to Survival of the Fittest"),
				"translateMessage": true
			});
			cmpGUIInterface.PushNotification({
				"players": players, 
				"message": markForTranslation("Collect treasures with your woman to prepare for the enemies."),
				"translateMessage": true
			});
			cmpGUIInterface.PushNotification({
				"players": players, 
				"message": markForTranslation("The first wave will start in " + TimeString({ time: data.argument }) + "!"),
				"translateMessage": true
			});
			break;
			
		case "beforeStart":
			var timeRemaining = data.argument;
			if(!timeRemaining)
			{
				break;
			}
			cmpGUIInterface.PushNotification({
				"players": players,
				"message": markForTranslation("The first wave will start in " + TimeString({ time: timeRemaining }) +", be prepared!"),
				"translateMessage": true
			});
			break;
			
		case "treasuresPlaced":
			cmpGUIInterface.PushNotification({
				"players": players,
				"message": markForTranslation("New treasures have been placed!"),
				"translateMessage": true
			});
			break;
			
		case "waveIncoming":
			cmpGUIInterface.PushNotification({
				"players": players, 
				"message": markForTranslation("Rioting soldiers are attacking you! Defend your City!"),
				"translateMessage": true
			});
			break;
		
		case "notifyRespawn":
			if(!data.argument.time || !data.argument.playerIDs)
			{
				warn("TalkToPlayers doesnt know whom to address");
				break;
			}
			cmpGUIInterface.PushNotification({
				"players": data.argument.playerIDs, 
				"message": markForTranslation("Your treasure seeker has died! You will get a new one in " + TimeString({ time: data.argument.time }) + "."),
				"translateMessage": true
			});
			break;
		
		case "resourceLoopStarted":
			cmpGUIInterface.PushNotification({
				"players": players, 
				"message": markForTranslation("From now on, you will receive some resources from time to time"),
				"translateMessage": true
			});
			break;
		
		default:
			warn("TalkToPlayers is panicking, some unknown gossip came in");
			break;
	}
}
 
Trigger.prototype.SpawnNewWoman = function(data)
{
	if(!data.playerId || data.playerId < 1)
	{
		warn("No women for gaia");
		return;
	}
	if(!cmpTrigger.females[data.playerId])
	{
		warn("This is not a treasure seeker: Player " + data.playerId);
		return;
	}
	var spawnPoints =  ["C","D","E","F"];
	if ( TriggerHelper.GetOwner(cmpTrigger.females[data.playerId]) != -1)
	{
		warn("Female still alive, exiting");
		return;
	}
	var newWoman = TriggerHelper.SpawnUnitsFromTriggerPoints(spawnPoints[data.playerId-1], data.template, 1, data.playerId);
	for(var w in newWoman)
	{
		cmpTrigger.females[data.playerId] = newWoman[w][0];
		break;
	}
}

/*
 * HandleSpecialEntities occurs when a unit dies, and checks for anything to be done in case its a treasure woman/civic center
 */

Trigger.prototype.HandleSpecialEntities = function(data)
{
	// Defeat a player that has lost his civic center
	if (data.entity == cmpTrigger.playerCivicCenter[data.from] && data.to == -1)
	{
		TriggerHelper.DefeatPlayer(data.from);
		spawnFlag[data.from] = false;
	
		// Check if only one player remains. He will be the winner.
		var lastPlayerStanding = 0;
		var numPlayersStanding = 0;
		var numberOfPlayers = TriggerHelper.GetNumberOfPlayers();
		for (var i = 1; i < numberOfPlayers; ++i)
		{
			if (TriggerHelper.GetPlayerComponent(i).GetState() == "active")
			{
				lastPlayerStanding = i;
				++numPlayersStanding;
			}
		}
		if (numPlayersStanding == 1)
		{
			TriggerHelper.SetPlayerWon(lastPlayerStanding);
		}
	}
	if(cmpTrigger.females[data.from] && data.from >= 1 && data.entity == cmpTrigger.females[data.from] && data.to == -1)
	{
		var cmpTemplateManager = Engine.QueryInterface(SYSTEM_ENTITY, IID_TemplateManager);
		var template = cmpTemplateManager.GetCurrentTemplateName(data.entity);
		var time = 15 * 1000; //time after which women respawn
		
		cmpTrigger.DoAfterDelay(time, "SpawnNewWoman", { playerId: data.from, template: template });
		
		this.TalkToPlayers({
			situation: "notifyRespawn",
			argument: {
				time: time,
				playerIDs: [data.from]
			}
		});
	}
}

/*
 * This function is constantly Looping and provides resources to all players.
 * It starts after resourceLoopOffset
 */

Trigger.prototype.ResourceLoop = function(data)
{
	resourceLoopCount++;
	
	if(resourceLoopCount == 1)
	{
		this.TalkToPlayers({
			situation: "resourceLoopStarted"
		});
	}
	
	var numberOfPlayers = TriggerHelper.GetNumberOfPlayers();
	for (var i = 1; i < numberOfPlayers; ++i)
	{
		var cmpPlayer = TriggerHelper.GetPlayerComponent(i);
		cmpPlayer.AddResources({
			wood: 100,
			stone: 100,
			metal: 100,
			food: 100
		});
	}
	cmpTrigger.DoAfterDelay( resourceLoopTime * 60 * 1000, "ResourceLoop" , {});
}


var cmpTrigger = Engine.QueryInterface(SYSTEM_ENTITY, IID_Trigger);

cmpTrigger.playerCivicCenter = {};
cmpTrigger.females = {};
cmpTrigger.playerTrack = {};

cmpTrigger.DoAfterDelay(0, "InitGame", {}); 
cmpTrigger.DoAfterDelay(1000, "InitializeEnemyWaves", {});
cmpTrigger.DoAfterDelay( resourceLoopOffset * 60 * 1000, "ResourceLoop" , {});

cmpTrigger.RegisterTrigger("OnOwnershipChanged", "HandleSpecialEntities", {"enabled": true});
