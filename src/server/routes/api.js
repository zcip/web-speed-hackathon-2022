import dayjs from "dayjs";
import { Between, LessThanOrEqual, MoreThanOrEqual } from "typeorm";
import zenginCode from "zengin-code";

import { BettingTicket, Race, User } from "../../model/index.js";
import { createConnection } from "../typeorm/connection.js";
import { initialize } from "../typeorm/initialize.js";

/**
 * 与えられたレースオブジェクトの画像URLの拡張子をjpgからwebpに変更する
 * @param {Race} race - 変更する画像URLを含むレースオブジェクト
 * @returns {Race} 拡張子をwebpに変更したレースオブジェクト
 */
function jpgToWebp(race) {
  return {
    ...race,
    entries: race.entries?.map((entry) => ({
      ...entry,
      player: {
        ...entry.player,
        image: entry.player.image.replace(/jpg$/, "webp"),
      },
    })),
    image: race.image.replace(/jpg$/, "webp"),
  };
}

/**
 * @type {import('fastify').FastifyPluginCallback}
 */
export const apiRoute = async (fastify) => {
  await fastify.register(import("@fastify/compress"), {
    encodings: ["gzip"],
  });

  fastify.get("/users/me", async (req, res) => {
    const repo = (await createConnection()).getRepository(User);

    if (req.user != null) {
      return res.send(req.user);
    } else {
      const user = await repo.save(new User());
      return res.send(user);
    }
  });

  fastify.post("/users/me/charge", async (req, res) => {
    if (req.user == null) {
      throw fastify.httpErrors.unauthorized();
    }

    const { amount } = req.body;
    if (typeof amount !== "number" || amount <= 0) {
      throw fastify.httpErrors.badRequest();
    }

    const repo = (await createConnection()).getRepository(User);

    req.user.balance += amount;
    await repo.save(req.user);

    return res.status(204).send();
  });

  fastify.get("/races", async (req, res) => {
    const since =
      req.query.since != null ? dayjs.unix(req.query.since) : undefined;
    const until =
      req.query.until != null ? dayjs.unix(req.query.until) : undefined;

    if (since != null && !since.isValid()) {
      throw fastify.httpErrors.badRequest();
    }
    if (until != null && !until.isValid()) {
      throw fastify.httpErrors.badRequest();
    }

    const repo = (await createConnection()).getRepository(Race);

    const where = {};
    if (since != null && until != null) {
      Object.assign(where, {
        startAt: Between(
          since.utc().format("YYYY-MM-DD HH:mm:ss"),
          until.utc().format("YYYY-MM-DD HH:mm:ss"),
        ),
      });
    } else if (since != null) {
      Object.assign(where, {
        startAt: MoreThanOrEqual(since.utc().format("YYYY-MM-DD HH:mm:ss")),
      });
    } else if (until != null) {
      Object.assign(where, {
        startAt: LessThanOrEqual(since.utc().format("YYYY-MM-DD HH:mm:ss")),
      });
    }

    const races = await repo.find({
      where,
    });

    const racesWithWebp = races.map((race) => jpgToWebp(race));

    return res.send({ races: racesWithWebp });
  });

  fastify.get("/races/:raceId", async (req, res) => {
    const repo = (await createConnection()).getRepository(Race);

    const race = await repo.findOne(req.params.raceId, {
      relations: ["entries", "entries.player"],
    });

    if (race === undefined) {
      throw fastify.httpErrors.notFound();
    }

    return res.send(jpgToWebp(race));
  });

  fastify.get("/races/:raceId/odds", async (req, res) => {
    const repo = (await createConnection()).getRepository(Race);

    const race = await repo.findOne(req.params.raceId, {
      relations: ["trifectaOdds"],
    });

    if (race === undefined) {
      throw fastify.httpErrors.notFound();
    }

    return res.send(race.trifectaOdds);
  });

  fastify.get("/races/:raceId/betting-tickets", async (req, res) => {
    if (req.user == null) {
      throw fastify.httpErrors.unauthorized();
    }

    const repo = (await createConnection()).getRepository(BettingTicket);
    const bettingTickets = await repo.find({
      where: {
        race: {
          id: req.params.raceId,
        },
        user: {
          id: req.user.id,
        },
      },
    });

    return res.send({
      bettingTickets,
    });
  });

  fastify.post("/races/:raceId/betting-tickets", async (req, res) => {
    if (req.user == null) {
      throw fastify.httpErrors.unauthorized();
    }

    if (req.user.balance < 100) {
      throw fastify.httpErrors.preconditionFailed();
    }

    if (typeof req.body.type !== "string") {
      throw fastify.httpErrors.badRequest();
    }

    if (
      !Array.isArray(req.body.key) ||
      req.body.key.some((n) => typeof n !== "number")
    ) {
      throw fastify.httpErrors.badRequest();
    }

    const bettingTicketRepo = (await createConnection()).getRepository(
      BettingTicket,
    );
    const bettingTicket = await bettingTicketRepo.save(
      new BettingTicket({
        key: req.body.key,
        race: {
          id: req.params.raceId,
        },
        type: req.body.type,
        user: {
          id: req.user.id,
        },
      }),
    );

    const userRepo = (await createConnection()).getRepository(User);
    req.user.balance -= 100;
    await userRepo.save(req.user);

    return res.send(bettingTicket);
  });

  fastify.get("/zengin/banklist", async (req, res) => {
    const bankList = Object.entries(zenginCode).map(([code, { name }]) => ({
      code,
      name,
    }));
    return res.send(bankList);
  });

  fastify.get("/zengin/bank/:bankCode", async (req, res) => {
    const bankCode = req.params.bankCode;
    if (req.params.bankCode == null) {
      throw fastify.httpErrors.badRequest();
    }
    const bank = zenginCode[bankCode];
    if (!bank) {
      throw fastify.httpErrors.badRequest();
    }
    return res.send(bank);
  });

  fastify.post("/initialize", async (_req, res) => {
    await initialize();
    return res.status(204).send();
  });
};
