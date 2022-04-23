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

	ns.disableLog("disableLog");
	ns.disableLog("getServerMaxMoney");
	ns.disableLog("getServerMinSecurityLevel");
	ns.disableLog("getServerSecurityLevel");
	ns.disableLog("getServerMoneyAvailable");

	ns.print("Starting hack on " + target);

	//check if server has root access, if not try to gain it using gainRoot.js
	if (!ns.hasRootAccess(target)) {
		ns.exec("gainRoot.js", "home", 1, target);
	}

	var moneyTresh = ns.getServerMaxMoney(target) * 0.75;
	var securityTresh = ns.getServerMinSecurityLevel(target) + 5;

	//infinite loop
	while (true) {
		var sec = ns.getServerSecurityLevel(target);
		var mon = ns.getServerMoneyAvailable(target);

		if (sec > securityTresh) {
			ns.print("Security level is too high. Value: " + sec + " Target: " + securityTresh + " Using Weaken now.");
			await ns.weaken(target);
		} else if (mon < moneyTresh) {
			ns.print("Available money on the Server is too low. Value: " + mon + " Target: " + moneyTresh + " Using Grow now.");
			await ns.grow(target);
		} else {
			ns.print("HACKING!");
			await ns.hack(target);
		}
	}
}