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

	let portsOpened = 0;

	//try BruteSSH.exe if it exists
	if (ns.fileExists("BruteSSH.exe", "home")) {
		ns.brutessh(target);
		++portsOpened;
	}

	//try FTPCrack.exe if it exists
	if (ns.fileExists("FTPCrack.exe", "home")) {
		ns.ftpcrack(target);
		++portsOpened;
	}

	//try relaySMTP.exe if it exists
	if (ns.fileExists("relaySMTP.exe", "home")) {
		ns.relaysmtp(target);
		++portsOpened;
	}

	//try HTTPWorm.exe if it exists
	if (ns.fileExists("HTTPWorm.exe", "home")) {
		ns.httpworm(target);
		++portsOpened;
	}

	//try SQLInject.exe if it exists
	if (ns.fileExists("SQLInject.exe", "home")) {
		ns.sqlinject(target);
		++portsOpened;
	}

	//Check if the Server actually is hackable and all ports are open.
	if (ns.getServerNumPortsRequired(target) <= portsOpened) {
		//Try to gain root access
		ns.nuke(target);
		ns.tprint(target + " Rooted!")
	} 
}