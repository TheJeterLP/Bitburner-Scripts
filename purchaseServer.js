/** @param {NS} ns */
export async function main(ns) {
	if (ns.args.length != 1) {
		ns.tprint("Usage: run purchaseServer.js [RAM]");
		return;
	}

	//the targeted ram
	var ram = ns.args[0];

	//Check if we have enough money to buy a server
	if (ns.getServerMoneyAvailable("home") < ns.getPurchasedServerCost(ram)) {
		ns.tprint("Not enough money to buy a bigger server.");
		return;
	}

	//the script running on the Servers.
	var targetScript = "hacking.js";

	//Array of all bought servers the user owns.
	const servers = ns.getPurchasedServers();

	var bought = false;

	//Iterate through every bought server.
	for (let i = 0; i < ns.getPurchasedServers().length; ++i) {
		var server = ns.getPurchasedServers()[i];

		//Check if the server has less ram than we want to buy
		if (ns.getServerMaxRam(server) >= ram) {
			continue;
		}

		ns.tprint("Deleting server and buying a new one.");

		//Kill the targetScript if it is still running.
		if (ns.scriptRunning(targetScript, server)) {
			ns.scriptKill(targetScript, server);
		}

		//try to delete old weak server and buy a new one
		if (ns.deleteServer(server)) {
			ns.tprint("Server deleted!");
			var hostname = ns.purchaseServer("pserv-" + ram + "-" + i, ram);
			ns.tprint("Bought a new server! Name: " + hostname);
			bought = true;
		} else {
			ns.tprint("Failed to delete Server!");
		}
	}

	if (!bought) {
		ns.tprint("All servers are up to date. Nothing was changed.");
	}
}