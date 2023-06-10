import { describe, it, expect } from 'vitest';
import { gearWheelProfile, gearWheelHelper } from './gearWheelProfile';

function degToRad(deg: number): number {
	return (deg / 180) * Math.PI;
}

describe('gearWheelProfile module', () => {
	const gw1 = gearWheelProfile();
	gw1.set1ModuleToothNumber(10, 23);
	gw1.set2CenterPosition(0, 0);
	gw1.set3CircleRadius(1, 1, 1, 2);
	gw1.set4BaseCircles(210, 210);
	gw1.set5AddendumThickness(50);
	gw1.set6Angles(0, 0);
	it('gearWheelProfile', () => {
		expect(gw1.getInvoluteAngles()).toBe(undefined);
	});
	it('gearWheelHelper', () => {
		const gw2 = gearWheelProfile();
		gw2.set1ModuleToothNumber(10, 29);
		expect(gearWheelHelper.gw2center(gw1, gw2, degToRad(0), 2)[0]).toBeCloseTo(262);
		expect(gearWheelHelper.gw2center(gw1, gw2, degToRad(0), 2)[1]).toBeCloseTo(0);
	});
});
