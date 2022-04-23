/** @param {NS} ns */
let maxNodes = 16;
let maxLevel = 200;

export async function main(ns) {
	let bought = 0;

	while (ns.hacknet.numNodes() < maxNodes) {
		if (ns.hacknet.getPurchaseNodeCost() > ns.getServerMoneyAvailable("home")) {
			ns.tprint("Not enough money to buy nodes.");
			break;
		}

		ns.hacknet.purchaseNode();
		++bought;
	}

	ns.tprint("Bought " + bought + " nodes.");

	if (ns.hacknet.numNodes() == 0) {
		return;
	}

	//upgrade level stuff
	for (let i = 0; i < ns.hacknet.numNodes(); ++i) {
		let currLevel = ns.hacknet.getNodeStats(i).level;

		if (currLevel >= maxLevel) continue;
		
		let diff = maxLevel - currLevel;

		if (ns.getServerMoneyAvailable("home") < ns.hacknet.getLevelUpgradeCost(i, diff)) continue;

		ns.hacknet.upgradeLevel(i, diff);
		ns.tprint("Upgraded level of note " + i + " to " + maxLevel);
	}
}