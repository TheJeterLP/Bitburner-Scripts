/** @param {NS} ns */

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
	if (ns.args.length != 1 || args[0] != "all") {
		ns.tprint("Usage: run stopHack.js all");
		return;
	}

	var targetScript = "hacking.js";

	let [servers, serverCons] = collect_server_names(ns);
	// Sort them by `hackAnalyzeChance`
	servers.sort((a, b) => ns.hackAnalyzeChance(a) - ns.hackAnalyzeChance(b));

	for (let i = 0; i < servers.length; ++i) {
		var target = servers[i];
		if (ns.fileExists(targetScript, target)) {
			if (ns.scriptRunning(targetScript, target)) {
				ns.scriptKill(targetScript, target);
				ns.tprint("Killed on " + target);
			}
		}
	}
}