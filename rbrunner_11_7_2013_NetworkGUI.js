#pragma strict

var menuState = "intro";

private var gameName = "";
private var gamePassword = "";
private var showList = false;
private var listEntry = 0;
private var list : GUIContent[];
private var listStyle : GUIStyle;
private var BackgroundStyle : GUIStyle;
private var picked = false;

var gameType = "Ant Game";
var startList = "Choose a Map";
var comment = "None Chosen";

var maps1 : Texture2D;
var maps2 : Texture2D;
var maps3 : Texture2D;
var maps4 : Texture2D;
var maps5 : Texture2D;


function Start () {

	

	// Make some content for the popup list
	list = new GUIContent[6];
	list[0] = new GUIContent(startList);
	list[1] = new GUIContent("Tropical Jungle");
	list[2] = new GUIContent("Forest");
	list[3] = new GUIContent("Winter Forest");
	list[4] = new GUIContent("Island Beach");
	list[5] = new GUIContent("Creepy Forest");
 
	// Make a GUIStyle that has a solid white hover/onHover background to indicate highlighted items
	listStyle = new GUIStyle();
	listStyle.normal.textColor = Color.white;
	var tex = new Texture2D(2, 2);
	var colors = new Color[4];
	for (color in colors) color = Color.white;
	tex.SetPixels(colors);
	tex.Apply();
	listStyle.hover.background = tex;
	listStyle.onHover.background = tex;
	listStyle.padding.left = listStyle.padding.right = listStyle.padding.top = listStyle.padding.bottom = 4;
	
	
}

function OnGUI()
{
	var loadSpacing = 80;
 //switch based on state
 if(menuState == "intro")
 {
 	GUI.Box(Rect((Screen.width/2 - 150), 10, 300, 50), "Project C");
 	
 	if(GUI.Button(Rect((Screen.width/2 - 75), 70, 150, 50), "Join Game"))
 	{
 	 menuState = "joinGame";
 	 MasterServer.RequestHostList(gameType);
 	}
 	
 	//host game button
 	if(GUI.Button(Rect((Screen.width/2 - 75), 130, 150, 50), "Host Game"))
 	{
 	 menuState = "hostGame";
 	}
  
 	if(GUI.Button(Rect((Screen.width/2 - 75), 190, 150, 50), "Options"))
 	{
 	 menuState = "options";
 	}
 	
 	if(GUI.Button(Rect((Screen.width/2 - 75), 250, 150, 50), "Quit Game"))
 	{
 	 //menuState = "options";
 	}
 	
 	
 }//end intro state
 else if(menuState == "hostGame")
 {
 	GUI.Box(Rect((Screen.width/2 - Screen.width/4), 10, (Screen.width/2), 50), "Host Game");
 	GUI.Label(Rect((Screen.width/5), 70, 150, 20), "Game Name: ");
 	GUI.Label(Rect((Screen.width/5), 100, 150, 20), "*Game Password: ");
 	GUI.Label(Rect((Screen.width/5), 115, 150, 20), "*(Optional)");
 	
 	if (Popup.List (Rect((Screen.width/5), 150, 130, 20), showList, listEntry, GUIContent(list[listEntry].text), list, listStyle)) {
		picked = true;
	}
	if (picked) {
		switch(listEntry){
			case 1:
				GUI.Label(Rect((Screen.width/5)+150,130,300,300),  maps1);
				comment = "Tropical Jungle";
				break;
			case 2:
				GUI.Label(Rect((Screen.width/5)+150,130,300,300),  maps2);
				comment = "Forest";
				break;
			case 3: 
				GUI.Label(Rect((Screen.width/5)+150,130,300,300),  maps3);
				comment = "Winter Forest";
				break;
			case 4:
				GUI.Label(Rect((Screen.width/5)+150,130,300,300),  maps4);
				comment = "Island Beach";
				break;
			case 5:
				GUI.Label(Rect((Screen.width/5)+150,130,300,300),  maps5);
				comment = "Creepy Forest";
				break;
		}
		
	}
 	gameName = GUI.TextField(Rect((Screen.width/5)+150, 70, Screen.width/2.5, 20), gameName, 40);
 	gamePassword = GUI.TextField(Rect((Screen.width/5)+150, 100, Screen.width/2.5, 20), gamePassword, 40);
 	 
 	if(GUI.Button(Rect((Screen.width/2)-200, 400, 175, 50), "Begin Game"))
 	{
 		if(picked){
		 	 Debug.Log("Click Begin Game");
		 	 LaunchServer();
	 	}
 	}
 	
 	if(GUI.Button(Rect((Screen.width/2)+25, 400, 175, 50), "Return to Main Menu"))
 	{
 		menuState = "intro";
 	}
 }//end host game state
 else if(menuState == "joinGame")
 {
 	var backgroundHeight = 0;
 	var data:HostData[] = MasterServer.PollHostList();
 	GUI.Box(Rect((Screen.width/2 - Screen.width/4), 10, (Screen.width/2), 50), "Join Game");
 	
 	for(var counter in data){
 		backgroundHeight+=50;
 	}
 	
 	GUI.Box(Rect((Screen.width/2)-240, 75, 360, backgroundHeight), ""); 
 	
 	for(var element in data)
 	{
 	 //GUILayout.BeginHorizontal();
 	 var name = element.gameName;// + " " + element.connectedPlayers + " / " + element.playerLimit;
 	 GUI.Label(Rect((Screen.width/2)-220,loadSpacing,150,50), name);
 	 
 	 GUI.Label(Rect((Screen.width/2)-40,loadSpacing,50,50), element.connectedPlayers + " / " + element.playerLimit);
 	 GUI.Label(Rect((Screen.width/2)+35,loadSpacing,50,50), element.comment);
 	
 	 
 	 //GUILayout.Label(name);
 	 //GUILayout.Space(5); //put five pixels of space between last and next
 	 //GUILayout.Label(element.comment);
 	 //GUILayout.FlexibleSpace();
 	 Debug.Log("useNat: " + element.useNat);

 	 if(GUI.Button(Rect((Screen.width/2)+150, loadSpacing+10, 70, 20), "Connect"))
 	 {
 	 Debug.Log("Trying to connect");
 	 Network.Connect(element);
 	 }
 	  
 	 //stop horizontal layout
 	 //GUILayout.EndHorizontal();
 	 loadSpacing+=50;
 	}
	
 	if(GUI.Button(Rect(0, Screen.height - 50, 150, 50), "Back to Menu"))
	 	{
	 	 menuState = "intro";
	 	}
 }
 else if(menuState == "options")
 {
 	if(GUI.Button(Rect(0, Screen.height - 50, 150, 50), "Back to Menu"))
	 	{
	 	 menuState = "intro";
	 	}
 }
}

function LaunchServer()
{
 Debug.Log("I am getting called");
  
 var useNAT = !Network.HavePublicAddress();
  
 Network.InitializeServer(8, 25000, useNAT);
  
 MasterServer.RegisterHost(gameType, gameName, comment);
}

function OnServerInitialized()
{
 Debug.Log("Server is setup and running");
 networkView.RPC("LoadLevel", RPCMode.AllBuffered, "game", 2);
}

@RPC
function LoadLevel(sceneName:String, levelPrefix:int)
{
 //stop sending messages for now
 Network.SetSendingEnabled(0, false);
  
 //stop getting messages
 Network.isMessageQueueRunning = false;
  
 Application.LoadLevel(sceneName);
 yield;
 yield;
}
