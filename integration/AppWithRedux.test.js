describe('AppWithRedux', () => {
	it('base example, visually looks correct', async () => {
		// APIs from jest-puppeteer
		await page.goto('http://localhost:9009/iframe.html?path=/story/appwithredux--app-with-redux-base-example');
		const image = await page.screenshot();

		// API from jest-image-snapshot
		expect(image).toMatchImageSnapshot();
	});
});