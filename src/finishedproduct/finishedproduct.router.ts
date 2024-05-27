import express from 'express';
import type {  Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

import * as finishedProductServer from './finishedproduct.server';

export const finishedProductRouter = express.Router();