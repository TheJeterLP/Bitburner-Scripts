/** @param {NS} ns */
export async function main(ns) {
	//Check for correct usage
	if (ns.args.length != 1) {
		ns.tprint("Wrong usage! use gainroot.js [targetServer] to gain root on a target Server.");
		return;
	}

	//get Target Server from arguments
	var target = ns.args[0];

	//Check if target exists
	if (!ns.serverExists(target)) {
		//Send error message
		ns.tprint("No target found with name " + target);
		return;
	}

	//check if we already have root access
	if (ns.hasRootAccess(target)) {
		//Send error message
		ns.tprint("Server already has root access.");
		return;
	}



	//sending message
	ns.tprint("Trying to gain root...");

	//try BruteSSH.exe if it exists
	if (ns.fileExists("BruteSSH.exe", "home")) {
		ns.brutessh(target);
	}

	//try FTPCrack.exe if it exists
	if (ns.fileExists("FTPCrack.exe", "home")) {
		ns.ftpcrack(target);
	}

	//try relaySMTP.exe if it exists
	if (ns.fileExists("relaySMTP.exe", "home")) {
		ns.relaysmtp(target);
	}

	//try HTTPWorm.exe if it exists
	if (ns.fileExists("HTTPWorm.exe", "home")) {
		ns.httpworm(target);
	}

	//try SQLInject.exe if it exists
	if (ns.fileExists("SQLInject.exe", "home")) {
		ns.sqlinject(target);
	}

	//Check if the Server actually is hackable and only needs 5 or less open Ports.
	if (ns.getServerNumPortsRequired(target) <= 5) {
		//Try to gain root access
		ns.nuke(target);
	} else {
		//Send error message
		ns.tprint("Not enough ports opened.");
	}

}