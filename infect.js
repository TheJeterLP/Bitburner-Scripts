/** @param {NS} ns */

//Search for servers
function collect_server_names(ns) {
	let fromServers = ['home'];
	let checkedServers = [];
	let serverConnections = new Map();

	for (let i = 0; i < 10000; i++) { // 'infinite' loop
		if (fromServers.length == 0) {
			break;
		}

		let server = fromServers.pop();
		checkedServers.push(server);

		serverConnections.set(server, []);

		for (let conServer of ns.scan(server)) {
			if (conServer == ".") { continue; }

			serverConnections.get(server).push(conServer);

			if (!checkedServers.includes(conServer)) {
				fromServers.push(conServer);
			}
		}
	}

	checkedServers.shift(); // remove home
	return [checkedServers, serverConnections];
}

export async function main(ns) {
	if (ns.args.length != 1) {
		ns.tprint("Usage: run infect.js [targetServer]");
		return;
	}

	//Script to copy and start on Servers.
	var targetScript = "hacking.js";
	//Arg for the Script - has to be a server
	var scriptArg = ns.args[0];

	//Check if target Server actually exists
	if (!ns.serverExists(scriptArg)) {
		ns.tprint(scriptArg + " is not a Server!");
		return;
	}

	let runningOn = 0;

	let [servers, serverCons] = collect_server_names(ns);
	// Sort them by `hackAnalyzeChance`
	servers.sort((a, b) => ns.hackAnalyzeChance(a) - ns.hackAnalyzeChance(b));

	//iterate through every Server that was found
	for (let i = 0; i < servers.length; ++i) {
		var target = servers[i];

		//Check if target is rooted
		if (!ns.hasRootAccess(target)) {
			ns.exec("gainRoot.js", "home", 1, target);
		}

		//check if gaining root worked. If not, continue.
		if (!ns.hasRootAccess(target)) {
			continue;
		}

		//Check if targetScript already exists on the Server, if its running do nothing. If not replace it.
		if (ns.fileExists(targetScript, target)) {
			if (ns.scriptRunning(targetScript, target)) {
				++runningOn;
				continue;
			}
			//Delete targetScript to replace it
			ns.rm(targetScript, target);
		}

		//Upload targetScript to targetServer
		await ns.scp(targetScript, "home", target);
		ns.tprint("Replaced Script file on " + target);

		//calculate how many threads can be used on the targetServer
		var usedRam = ns.getScriptRam(targetScript, target);
		let freeRam = ns.getServerMaxRam(target) - ns.getServerUsedRam(target);
		let threads = Math.floor(freeRam / usedRam);

		if (threads < 1) {
			continue;
		}

		//Execute targetScript on targetServer
		let pid = ns.exec(targetScript, target, threads, scriptArg);

		//Check if Script was started successfully
		if (pid > 0) {
			++runningOn;
			ns.tprint("Script running on " + target + " with " + threads + " Threads!");
		} else {
			ns.tprint("No PID returned, script is NOT running!");
		}
	}
	ns.tprint("Script finished. Hack is running on " + runningOn + " Servers.");
}