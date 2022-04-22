/** @param {NS} ns */
export async function main(ns) {

	//Check for correct usage
	if (ns.args.length != 1) {
		ns.tprint("Wrong usage! use hacking.js [targetServer] to start hacking of a target Server.");
		return;
	}

	//get target server from first argument
	var target = ns.args[0];

	//check if server exists
	if (!ns.serverExists(target)) {
		ns.tprint("Server " + target + " cannot be found!");
		return;
	}

	//check if server has root access, if not try to gain it using gainRoot.js
	if (!ns.hasRootAccess(target)) {
		ns.exec("gainRoot.js", "home", 1, target);
	}

	var moneyTresh = ns.getServerMaxMoney(target) * 0.75;
	var securityTresh = ns.getServerMinSecurityLevel(target) + 5;

	//infinite loop
	while (true) {
		if (ns.getServerSecurityLevel(target) > securityTresh) {
			await ns.weaken(target);
		} else if (ns.getServerMoneyAvailable(target) < moneyTresh) {
			await ns.grow(target);
		} else {
			await ns.hack(target);
		}
	}
}