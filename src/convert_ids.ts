const json = await Bun.file('../order-ids.json').json();
const ids = json.ids.map((v: any) => `'${v['$oid']}'`);
await Bun.write('/data/order-ids.ts', `const SP_IDS = [${ids.toString()}];`);