/*
 * This is the Script containing all the Triggers for the "Survival of the Fittest" Map.
 */ 
var firstWaveTime = 0.02; //Time in minutes when the first wave will start
var waveInterval = 0.09; //Time in minutes when waves will spawn, after the first one
var defendersWaveInterval = 0.3;
var waveCount = 1;
warn("here");
var persianAttacker = {

	champion: [
							   "units/pers_champion_infantry",
							   "units/pers_kardakes_hoplite"
			  ],
	infantry: [
								"units/pers_infantry_spearman_e",
			  ],
	ranged: [
								"units/pers_infantry_archer_e",
								"units/pers_kardakes_skirmisher"
			  ],

}

var romanDefenders = {

	champion: [
							   "units/rome_centurio_imperial",
							   "units/rome_champion_infantry"
			  ],
	infantry: [
								"units/rome_infantry_spearman_e",
								"units/rome_legionnaire_imperial",
								"units/rome_legionnaire_marian"
			  ],
	ranged: [
								"units/rome_infantry_javelinist_e",
			  ],

}

// Trigger.prototype.attackAtSpecificPoint = function()
// {
// 	var playerID = 2;
// 	var siegeEngine = TriggerHelper.SpawnUnitsFromTriggerPoints("B", "units/avars_mechanical_siege_ballista", 1, playerID);
// 	uneval(TriggerHelper.GetOwner(siegeEngine));
	

// }

// Trigger.prototype.attackAtSpecificPoint = function()
// {
// 	var playerID = 2;
// 	//var playerIDD = 1;
// 	var siegeEngine = TriggerHelper.SpawnUnitsFromTriggerPoints("C", "units/avars_mechanical_siege_ballista", 1, playerID);
// 	warn(uneval(siegeEngine));
// 	var unitAI = Engine.QueryInterface(siegeEngine[0], IID_Attack);

// 	this.unitAI.AttackVisibleEntity(123,true);
// 	var cmd = {}

// 	var cmd = {"type": "attack", "target": 123, "queued": true}
// 	//var cmd = {"type": "attack", "target": 120, "queued": true, "entities" : [120, 122]}

// 	// cmd.type = "attack";
// 	// cmd.entities = playerID;
// 	// cmd.queued = true;
// 	// cmd.targetClasses = { "attack": ["other/fence_stone_untarget"] };
// 	ProcessCommand(playerID, cmd);

// 	//this.DoAfterDelay(0.1, "attackAtSpecificPoint", {});

// }

Capturable.prototype.CanCapture = function(player) 
{ 
	return false; 
}

Trigger.prototype.defend = function()
{

	warn(waveCount);
	var playerID = 1;
	waveCount++;
	var cmpTimer = Engine.QueryInterface(SYSTEM_ENTITY, IID_Timer);

	var championCounter = waveCount;
	var infantryCounter = waveCount;
	var rangedCounter = waveCount;

	if(waveCount == 3){
		waveCount = 0;
	}

	// if(waveCount === 1){
	// 	championCounter = 2;
	// 	infantryCounter = 4;
	// 	rangedCounter = 4;
	// }

	var championEntity = romanDefenders.champion[Math.floor(Math.random() * romanDefenders.champion.length)];
	var infantryEntity = romanDefenders.infantry[Math.floor(Math.random() * romanDefenders.infantry.length)];
	var rangedEntity = romanDefenders.ranged[Math.floor(Math.random() * romanDefenders.ranged.length)];

	// Spawn attackers
	var multipleAttackers = [];
	var helper;

	if(championCounter > 0)
	{
		helper = TriggerHelper.SpawnUnitsFromTriggerPoints("B", championEntity, 1/*championCounter*/, playerID);
		multipleAttackers.push(helper);
	}
	if(infantryCounter > 0)
	{
		helper = TriggerHelper.SpawnUnitsFromTriggerPoints("B", infantryEntity, 1/*infantryCounter*/, playerID);
		multipleAttackers.push(helper);
	}
	if(rangedCounter > 0)
	{
		helper = TriggerHelper.SpawnUnitsFromTriggerPoints("B",rangedEntity, 1/*rangedCounter*/, playerID);
		multipleAttackers.push(helper);
	}
	
	this.TalkToPlayers({ situation: "waveIncoming", argument: false });
	cmpTrigger.DoAfterDelay(defendersWaveInterval * 60 * 1000, "defend", {});
}

Trigger.prototype.startAttack = function() 
{

	var playerID = 2;
	waveCount++;
	var cmpTimer = Engine.QueryInterface(SYSTEM_ENTITY, IID_Timer);

	var championCounter = waveCount;
	var infantryCounter = waveCount;
	var rangedCounter = waveCount;

	if(waveCount == 3){
		waveCount = 0;
	}

	// if(waveCount === 1){
	// 	championCounter = 2;
	// 	infantryCounter = 4;
	// 	rangedCounter = 4;
	// }

	var championEntity = persianAttacker.champion[Math.floor(Math.random() * persianAttacker.champion.length)];
	var infantryEntity = persianAttacker.infantry[Math.floor(Math.random() * persianAttacker.infantry.length)];
	var rangedEntity = persianAttacker.ranged[Math.floor(Math.random() * persianAttacker.ranged.length)];

	// Spawn attackers
	var multipleAttackers = [];
	var helper;

	if(championCounter > 0)
	{
		helper = TriggerHelper.SpawnUnitsFromTriggerPoints("A", championEntity, 1/*championCounter+2*/, playerID);
		multipleAttackers.push(helper);
	}
	if(infantryCounter > 0)
	{
		helper = TriggerHelper.SpawnUnitsFromTriggerPoints("A", infantryEntity, 1/*infantryCounter+2*/, playerID);
		multipleAttackers.push(helper);
	}
	if(rangedCounter > 0)
	{
		helper = TriggerHelper.SpawnUnitsFromTriggerPoints("A",rangedEntity, 1/*rangedCounter*/, playerID);
		multipleAttackers.push(helper);
	}
	
	this.TalkToPlayers({ situation: "waveIncoming", argument: false });
	cmpTrigger.DoAfterDelay(waveInterval * 60 * 1000, "startAttack", {});
}

Trigger.prototype.InitializeEnemyWaves = function()
{
	/*
	 * This function starts the timer for the waves 
	 */
	this.TalkToPlayers({situation: "beginGame", argument: firstWaveTime * 60 * 1000});
	cmpTrigger.DoAfterDelay(firstWaveTime * 60 * 1000, "startAttack", {});
	cmpTrigger.DoAfterDelay(firstWaveTime * 60 * 1000, "defend", {});
	cmpTrigger.DoAfterDelay(firstWaveTime * 60 * 1000 - 1 * 60 * 1000, "TalkToPlayers", { situation: "beforeStart", argument: 1 * 60 * 1000 });
}

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
				"players": [1], 
				"message": markForTranslation("Welcome to Survival of the Fittest"),
				"translateMessage": true
			});
			cmpGUIInterface.PushNotification({
				"players": [1], 
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
				"message": markForTranslation("Persians are attacking you!"),
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





var cmpTrigger = Engine.QueryInterface(SYSTEM_ENTITY, IID_Trigger);

//cmpTrigger.DoAfterDelay(0, "InitGame", {}); 
cmpTrigger.DoAfterDelay(1000, "InitializeEnemyWaves", {});
cmpTrigger.attackTime = 5; // attack in 1 minute
//cmpTrigger.DoAfterDelay(cmpTrigger.attackTime, "attackAtSpecificPoint", {});