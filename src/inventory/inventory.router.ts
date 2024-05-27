import express from 'express';
import type {  Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

import * as inventoryServer from './inventory.server';

export const inventoryRouter = express.Router();