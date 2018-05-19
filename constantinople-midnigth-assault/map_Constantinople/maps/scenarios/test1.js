/*
 * This is the Script containing all the Triggers for the "Survival of the Fittest" Map.
 */ 

var spawnFlag = [false, false, false, false, false, false, false, false];
				 
var waveCount = 0;
var resourceLoopCount = 0;
var initialWave = 0
var firstWaveTime = 2; //Time in minutes when the first wave will start
var waveInterval = 2; //Time in minutes when waves will spawn, after the first one

//These are the templates of the attacking units, sorted by type
var waveAttackers = {

	champion: [

							   "units/pers_champion_infantry",
							   "units/pers_kardakes_hoplite"
			  ],
	infantry: [
								"units/pers_infantry_archer_e",
								"units/pers_infantry_spearman_e",
								"units/pers_kardakes_skirmisher"

			  ],
}
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
		infantryCount = 5;
		championCount = 5;
	}
	
	var infantryEntity = waveAttackers.infantry[Math.floor(Math.random() * waveAttackers.infantry.length)];
	var championEntity = waveAttackers.champion[Math.floor(Math.random() * waveAttackers.champion.length)];

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
	//order Attackers to attack

	this.TalkToPlayers({ situation: "waveIncoming", argument: false });
	cmpTrigger.DoAfterDelay(waveInterval * 60 * 1000, "StartAnEnemyWave", {});
}

/*
 * The main init function, called at the start
 */

Trigger.prototype.InitGame = function()
{
	var numberOfPlayers = TriggerHelper.GetNumberOfPlayers();
}

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


var cmpTrigger = Engine.QueryInterface(SYSTEM_ENTITY, IID_Trigger);

cmpTrigger.playerCivicCenter = {};
cmpTrigger.females = {};
cmpTrigger.playerTrack = {};

cmpTrigger.DoAfterDelay(0, "InitGame", {}); 
cmpTrigger.DoAfterDelay(1000, "InitializeEnemyWaves", {});
//cmpTrigger.DoAfterDelay( resourceLoopOffset * 60 * 1000, "ResourceLoop" , {});

cmpTrigger.RegisterTrigger("OnOwnershipChanged", "HandleSpecialEntities", {"enabled": true});
