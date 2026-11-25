import assert from "node:assert/strict";
import test from "node:test";
import { formatDate, parseDate, todayStart } from "../src/utils/date.js";
import { Event } from "../src/models/event-model.js";

test("tarih UTC olarak ayrıştırılır ve aynı biçimde sunulur", () => {
  for (const value of ["15-10-2026", "29-02-2028", "01-01-2000", "31-12-2026"]) {
    const date = parseDate(value);
    assert.ok(date instanceof Date);
    assert.equal(date.getUTCHours(), 0);
    assert.equal(formatDate(date), value);
  }
});

test("yanlış biçim ve olmayan takvim tarihleri reddedilir", () => {
  for (const value of ["2026-12-20", "31-02-2026", "29-02-2026", "00-12-2026", "15-13-2026", "1-12-2026", "", 123, {}]) {
    assert.ok(Number.isNaN(parseDate(value).getTime()));
  }
});

test("bugünün başlangıcı UTC gece yarısıdır", () => {
  const before = Date.now();
  const start = todayStart();
  const after = Date.now();
  assert.ok(start.getTime() <= after);
  assert.ok(start.getTime() > before - 86400000);
  assert.equal(start.getUTCHours(), 0);
  assert.equal(start.getUTCMinutes(), 0);
  assert.equal(start.getUTCSeconds(), 0);
  assert.equal(start.getUTCMilliseconds(), 0);
});

test("model Date saklar, JSON gün-ay-yıl sunar", async () => {
  const event = new Event({ title: "Tarih Denemesi", category: "Atölye", date: "20-12-2026" });
  await event.validate();
  assert.ok(event.get("date", null, { getters: false }) instanceof Date);
  assert.equal(event.toJSON().date, "20-12-2026");
  assert.equal(event.toJSON().id, undefined);
});

test("model geçersiz tarih ve eksik tarihi kabul etmez", async () => {
  for (const date of ["31-02-2026", "2026-12-20", undefined, null]) {
    const event = new Event({ title: "Tarih Denemesi", category: "Atölye", date });
    await assert.rejects(event.validate(), { name: "ValidationError" });
  }
});
