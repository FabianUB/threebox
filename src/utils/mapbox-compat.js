const Constants = require('./constants.js');

const DEG2RAD = Math.PI / 180;

function getTransform(map) {
	if (!map) return null;
	return map.transform || null;
}

function getFov(transform) {
	if (!transform) return Constants.FOV;
	if (typeof transform._fov === 'number') return transform._fov;
	if (typeof transform.fov === 'number') return transform.fov;
	return Constants.FOV;
}

function setFov(transform, value) {
	if (!transform) return;
	if (typeof transform._fov === 'number') transform._fov = value;
	else if ('fov' in transform) transform.fov = value;
}

function getPitch(map, transform) {
	if (transform && typeof transform._pitch === 'number') return transform._pitch;
	if (map && typeof map.getPitch === 'function') return map.getPitch() * DEG2RAD;
	return 0;
}

function getMaxPitch(map, transform) {
	if (transform && typeof transform._maxPitch === 'number') return transform._maxPitch * DEG2RAD;
	if (map && typeof map.getMaxPitch === 'function') return map.getMaxPitch() * DEG2RAD;
	return 60 * DEG2RAD;
}

function getHorizonShift(transform) {
	if (!transform) return 0.1;
	if (typeof transform._horizonShift === 'number') return transform._horizonShift;
	if (typeof transform.horizonShift === 'number') return transform.horizonShift;
	return 0.1;
}

function getCenterOffset(transform) {
	if (!transform) return { x: 0, y: 0 };
	return transform.centerOffset || transform._centerOffset || { x: 0, y: 0 };
}

function getScale(transform) {
	if (!transform) return 1;
	if (typeof transform.scale === 'number') return transform.scale;
	if (typeof transform._scale === 'number') return transform._scale;
	return 1;
}

function getCamera(map, transform) {
	if (transform && transform._camera) return transform._camera;
	if (transform && transform.camera) return transform.camera;
	if (map && typeof map.getFreeCameraOptions === 'function') {
		const options = map.getFreeCameraOptions();
		if (options) {
			const pos = options.position ? [options.position.x, options.position.y, options.position.z] : [0, 0, 0];
			const orientation = options.orientation ? [options.orientation.x, options.orientation.y, options.orientation.z, options.orientation.w] : [0, 0, 0, 1];
			return {
				position: pos,
				orientation: orientation,
				forward() {
					// minimal forward vector approximation; Mapbox returns mercatorPosition in meters.
					let dir;
					if (options.lookAtPoint && options.position) {
						dir = [
							options.lookAtPoint.x - options.position.x,
							options.lookAtPoint.y - options.position.y,
							options.lookAtPoint.z - options.position.z
						];
					} else {
						dir = [0, 0, -1];
					}
					const len = Math.hypot(dir[0], dir[1], dir[2]) || 1;
					return [dir[0] / len, dir[1] / len, dir[2] / len];
				}
			};
		}
	}
	return null;
}

function getCameraOrientation(map, transform) {
	const camera = getCamera(map, transform);
	if (camera) {
		if (camera._orientation) return camera._orientation;
		if (camera.orientation) return camera.orientation;
	}
	return [0, 0, 0, 1];
}

function getCameraZoom(map, transform) {
	if (transform && typeof transform._cameraZoom === 'number') return transform._cameraZoom;
	if (transform && typeof transform._zoom === 'number') return transform._zoom;
	if (map && typeof map.getZoom === 'function') return map.getZoom();
	return 0;
}

function getCenterAltitude(transform) {
	if (transform && typeof transform._centerAltitude === 'number') return transform._centerAltitude;
	return 0;
}

function getCenter(transform) {
	if (!transform) return { lat: 0, lng: 0 };
	return transform.center || transform._center || { lat: 0, lng: 0 };
}

function getCameraToCenterDistance(transform) {
	if (transform && typeof transform.cameraToCenterDistance === 'number') return transform.cameraToCenterDistance;
	return 0;
}

function getPoint(transform) {
	if (!transform) return { x: 0, y: 0 };
	return transform.point || transform._point || { x: 0, y: 0 };
}

function getTranslation(transform) {
	const point = getPoint(transform);
	return {
		x: transform && typeof transform.x === 'number' ? transform.x : point.x,
		y: transform && typeof transform.y === 'number' ? transform.y : point.y
	};
}

module.exports = {
	getTransform,
	getFov,
	setFov,
	getPitch,
	getMaxPitch,
	getHorizonShift,
	getCenterOffset,
	getScale,
	getCamera,
	getCameraOrientation,
	getCameraZoom,
	getCenterAltitude,
	getCenter,
	getCameraToCenterDistance,
	getPoint,
	getTranslation
};
