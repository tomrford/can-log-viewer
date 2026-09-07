import { describe, expect, it } from 'vitest';
import {
	boxViewport,
	dataPointAtRatio,
	paddedXRange,
	paddedYRange,
	panViewport,
	ratioAtDataPoint,
	viewportCenter,
	viewportCenterX,
	zoomViewport
} from './plot-viewport';

describe('plot viewport math', () => {
	it('pads the y axis and keeps the x axis tight', () => {
		expect(paddedXRange(0, 100)).toEqual({ min: 0, max: 100 });
		expect(paddedYRange(10, 20)).toEqual({ min: 9.5, max: 20.5 });
	});

	it('pads equal extents around the shared value', () => {
		expect(paddedXRange(5, 5)).toEqual({ min: 4, max: 6 });
		expect(paddedYRange(100, 100)).toEqual({ min: 95, max: 105 });
	});

	it('rejects non-finite extents', () => {
		expect(paddedXRange(0, Number.POSITIVE_INFINITY)).toBeNull();
		expect(paddedYRange(Number.NaN, 1)).toBeNull();
	});

	it('pans in data units from pixel movement', () => {
		expect(
			panViewport(
				{ xMin: 0, xMax: 100, yMin: 0, yMax: 50 },
				{ x: 10, y: -20 },
				{ width: 100, height: 100 }
			)
		).toEqual({ xMin: -10, xMax: 90, yMin: -10, yMax: 40 });
	});

	it('zooms around the pointer anchor', () => {
		expect(
			zoomViewport({ xMin: 0, xMax: 100, yMin: 0, yMax: 100 }, 0.5, {
				xRatio: 0.25,
				yRatio: 0.75
			})
		).toEqual({ xMin: 12.5, xMax: 62.5, yMin: 12.5, yMax: 62.5 });
	});

	it('maps a selection box into data coordinates', () => {
		expect(
			boxViewport(
				{ xMin: 0, xMax: 100, yMin: 0, yMax: 200 },
				{ xRatio: 0.8, yRatio: 0.2 },
				{ xRatio: 0.2, yRatio: 0.7 }
			)
		).toEqual({ xMin: 20, xMax: 80, yMin: 60, yMax: 160 });
	});

	it('returns the x-axis midpoint', () => {
		expect(viewportCenterX({ xMin: 0, xMax: 100 })).toBe(50);
	});

	it('maps crosshair coordinates between data and screen ratios', () => {
		const viewport = { xMin: 10, xMax: 110, yMin: -20, yMax: 80 };
		const point = dataPointAtRatio(viewport, { xRatio: 0.25, yRatio: 0.75 });

		expect(point).toEqual({ x: 35, y: 5 });
		expect(ratioAtDataPoint(viewport, point)).toEqual({ xRatio: 0.25, yRatio: 0.75 });
		expect(viewportCenter(viewport)).toEqual({ x: 60, y: 30 });
	});
});
