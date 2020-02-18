module.exports =
/******/ (function(modules, runtime) { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	__webpack_require__.ab = __dirname + "/";
/******/
/******/ 	// the startup function
/******/ 	function startup() {
/******/ 		// Load entry module and return exports
/******/ 		return __webpack_require__(198);
/******/ 	};
/******/
/******/ 	// run startup
/******/ 	return startup();
/******/ })
/************************************************************************/
/******/ ({

/***/ 19:
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.init = (config) => {
    var _a;
    const tables = ((_a = config.tables) === null || _a === void 0 ? void 0 : _a.split(',').map(s => s.trim()).reduce((prev, current) => (Object.assign(Object.assign({}, prev), { [current]: current })), {})) || {};
    return {
        error: false,
        result: {
            operations: {
                DELETE: 'DELETE',
                FINDMANY: 'FINDMANY',
                INIT: 'INIT',
                UPSERT: 'UPSERT',
                FINDONE: 'FINDONE',
                DELETEONE: 'DELETEONE',
                DELETEMANY: 'DELETEMANY',
                UPDATEONE: 'UPDATEONE',
                UPDATEMANY: 'UPDATEMANY',
                DROPTABLE: 'DROPTABLE'
            },
            tables
        }
    };
};


/***/ }),

/***/ 82:
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.drop = (config, db) => {
    const table = config.table;
    db.dropTable(table);
    return {
        result: {
            table
        },
        error: null
    };
};


/***/ }),

/***/ 86:
/***/ (function(module, __unusedexports, __webpack_require__) {

var rng = __webpack_require__(139);
var bytesToUuid = __webpack_require__(722);

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html

var _nodeId;
var _clockseq;

// Previous uuid creation time
var _lastMSecs = 0;
var _lastNSecs = 0;

// See https://github.com/uuidjs/uuid for API details
function v1(options, buf, offset) {
  var i = buf && offset || 0;
  var b = buf || [];

  options = options || {};
  var node = options.node || _nodeId;
  var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq;

  // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189
  if (node == null || clockseq == null) {
    var seedBytes = rng();
    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [
        seedBytes[0] | 0x01,
        seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]
      ];
    }
    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  }

  // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
  var msecs = options.msecs !== undefined ? options.msecs : new Date().getTime();

  // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock
  var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1;

  // Time since last uuid creation (in msecs)
  var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;

  // Per 4.2.1.2, Bump clockseq on clock regression
  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  }

  // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval
  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  }

  // Per 4.2.1.2 Throw error if too many uuids are requested
  if (nsecs >= 10000) {
    throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq;

  // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
  msecs += 12219292800000;

  // `time_low`
  var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff;

  // `time_mid`
  var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff;

  // `time_high_and_version`
  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
  b[i++] = tmh >>> 16 & 0xff;

  // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
  b[i++] = clockseq >>> 8 | 0x80;

  // `clock_seq_low`
  b[i++] = clockseq & 0xff;

  // `node`
  for (var n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf ? buf : bytesToUuid(b);
}

module.exports = v1;


/***/ }),

/***/ 87:
/***/ (function(module) {

module.exports = require("os");

/***/ }),

/***/ 129:
/***/ (function(module) {

module.exports = require("child_process");

/***/ }),

/***/ 139:
/***/ (function(module, __unusedexports, __webpack_require__) {

// Unique ID creation requires a high quality random # generator.  In node.js
// this is pretty straight-forward - we use the crypto API.

var crypto = __webpack_require__(417);

module.exports = function nodeRNG() {
  return crypto.randomBytes(16);
};


/***/ }),

/***/ 198:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(__webpack_require__(470));
const path_1 = __importDefault(__webpack_require__(622));
const parameters_1 = __webpack_require__(597);
const operations_1 = __importDefault(__webpack_require__(839));
const db_driver_1 = __webpack_require__(842);
const commit_1 = __webpack_require__(671);
function run() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const operation = core.getInput('operation', {
            required: true
        });
        core.info(`Running ${operation} operation`);
        const parsedConfig = parameters_1.resolveRequiredParameters({
            operation,
            table: core.getInput('table'),
            record: core.getInput('record'),
            basedir: core.getInput('basedir') || 'db',
            query: core.getInput('query'),
            tables: core.getInput('tables'),
            verbose: core.getInput('verbose') == 'true'
        });
        core.info(`Basedir: ${path_1.default.resolve('./' + ((_a = parsedConfig.config) === null || _a === void 0 ? void 0 : _a.basedir))}`);
        if (!parsedConfig.valid) {
            return core.setFailed(`Missing required configuration keys for operation ${operation}: ${JSON.stringify(parsedConfig.missingKeys)}`);
        }
        const db = new db_driver_1.DatabaseDriver(parsedConfig.config.basedir);
        if (parsedConfig.config.verbose) {
            core.info(`Operation: ${parsedConfig.config.operation}`);
            core.info(`Config: ${JSON.stringify(parsedConfig, null, 2)}`);
        }
        const operationResult = operations_1.default[parsedConfig.config.operation](parsedConfig.config, db);
        if (parsedConfig.config.verbose) {
            core.info(`Result: ${JSON.stringify(operationResult.result, null, 2)}`);
        }
        core.info(JSON.stringify(operationResult.result));
        core.setOutput('result', JSON.stringify(operationResult.result));
        if (db.dirty) {
            core.info('Committing changes...');
            yield commit_1.commit();
        }
    });
}
run();


/***/ }),

/***/ 211:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const createQueryFilter_1 = __webpack_require__(657);
exports.deleteRecords = (config, db) => {
    const table = config.table;
    const query = JSON.parse(config.query);
    const operation = config.operation;
    let data = db.readTable(table);
    const queryFilter = createQueryFilter_1.createQueryFilter(query);
    const candidates = data.filter(queryFilter).map(rec => rec._id);
    const recordsToDelete = operation === 'DELETEMANY'
        ? candidates
        : candidates.length > 0
            ? [candidates[0]]
            : [];
    data = data.map(rec => recordsToDelete.includes(rec._id) ? Object.assign(Object.assign({}, rec), { __delete: true }) : rec);
    db.flushTable(table, data);
    return {
        error: null,
        result: {
            count: recordsToDelete.length,
            deletedRecordIds: recordsToDelete
        }
    };
};


/***/ }),

/***/ 417:
/***/ (function(module) {

module.exports = require("crypto");

/***/ }),

/***/ 431:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const os = __webpack_require__(87);
/**
 * Commands
 *
 * Command Format:
 *   ##[name key=value;key=value]message
 *
 * Examples:
 *   ##[warning]This is the user warning message
 *   ##[set-secret name=mypassword]definitelyNotAPassword!
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        // safely append the val - avoid blowing up when attempting to
                        // call .replace() if message is not a string for some reason
                        cmdStr += `${key}=${escape(`${val || ''}`)},`;
                    }
                }
            }
        }
        cmdStr += CMD_STRING;
        // safely append the message - avoid blowing up when attempting to
        // call .replace() if message is not a string for some reason
        const message = `${this.message || ''}`;
        cmdStr += escapeData(message);
        return cmdStr;
    }
}
function escapeData(s) {
    return s.replace(/\r/g, '%0D').replace(/\n/g, '%0A');
}
function escape(s) {
    return s
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/]/g, '%5D')
        .replace(/;/g, '%3B');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 470:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = __webpack_require__(431);
const os = __webpack_require__(87);
const path = __webpack_require__(622);
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable
 */
function exportVariable(name, val) {
    process.env[name] = val;
    command_1.issueCommand('set-env', { name }, val);
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    command_1.issueCommand('add-path', {}, inputPath);
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.  The value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store
 */
function setOutput(name, value) {
    command_1.issueCommand('set-output', { name }, value);
}
exports.setOutput = setOutput;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message
 */
function error(message) {
    command_1.issue('error', message);
}
exports.error = error;
/**
 * Adds an warning issue
 * @param message warning issue message
 */
function warning(message) {
    command_1.issue('warning', message);
}
exports.warning = warning;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store
 */
function saveState(name, value) {
    command_1.issueCommand('save-state', { name }, value);
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 597:
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const requiredParametersForOperation = {
    INIT: [],
    DELETEONE: ['table', 'query'],
    DELETEMANY: ['table', 'query'],
    FINDONE: ['table', 'query'],
    FINDMANY: ['table', 'query'],
    UPSERT: ['table', 'record'],
    UPDATEONE: ['table', 'record', 'query'],
    UPDATEMANY: ['table', 'record', 'query'],
    DROPTABLE: ['table']
};
function missingParameters(config, requiredParameters) {
    const missing = requiredParameters
        .map(p => (config[p] ? null : p))
        .filter(notEmpty);
    return missing.length > 0 ? missing : false;
}
exports.missingParameters = missingParameters;
function notEmpty(value) {
    return value !== null && value !== undefined;
}
function resolveRequiredParameters(config) {
    const missingKeys = missingParameters(config, requiredParametersForOperation[config.operation]);
    return missingKeys
        ? { valid: false, missingKeys, config: null }
        : { valid: true, missingKeys: null, config };
}
exports.resolveRequiredParameters = resolveRequiredParameters;


/***/ }),

/***/ 622:
/***/ (function(module) {

module.exports = require("path");

/***/ }),

/***/ 657:
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function createQueryFilter(query) {
    return (value) => {
        return Object.keys(query)
            .map(key => value[key] === query[key])
            .reduce((prev, current) => prev && current, true);
    };
}
exports.createQueryFilter = createQueryFilter;


/***/ }),

/***/ 671:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = __webpack_require__(129);
const path_1 = __importDefault(__webpack_require__(622));
const exec = (cmd, args = []) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        // console.log(`Started: ${cmd} ${args.join(' ')}`)
        const app = child_process_1.spawn(cmd, args, { stdio: 'inherit' });
        app.on('close', (code) => {
            if (code !== 0) {
                const err = new Error(`Invalid status code: ${code}`);
                err.code = code;
                return reject(err);
            }
            return resolve(code);
        });
        app.on('error', reject);
    });
});
exports.commit = () => __awaiter(void 0, void 0, void 0, function* () {
    yield exec('bash', [path_1.default.join(__dirname, './start.sh')]);
});


/***/ }),

/***/ 674:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const createQueryFilter_1 = __webpack_require__(657);
exports.find = (config, db) => {
    const table = config.table;
    const query = JSON.parse(config.query || '{}');
    const operation = config.operation;
    const data = db.readTable(table);
    const queryFilter = createQueryFilter_1.createQueryFilter(query);
    const results = data.filter(queryFilter);
    switch (operation) {
        case 'FINDMANY': {
            return {
                result: {
                    found: results.length > 0,
                    count: results.length,
                    records: results
                },
                error: null
            };
        }
        case 'FINDONE': {
            return {
                result: {
                    found: results.length > 0,
                    count: results.length,
                    record: results.length > 0 ? results[0] : {}
                },
                error: null
            };
        }
    }
};


/***/ }),

/***/ 722:
/***/ (function(module) {

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid(buf, offset) {
  var i = offset || 0;
  var bth = byteToHex;
  // join used to fix memory issue caused by concatenation: https://bugs.chromium.org/p/v8/issues/detail?id=3175#c4
  return ([
    bth[buf[i++]], bth[buf[i++]],
    bth[buf[i++]], bth[buf[i++]], '-',
    bth[buf[i++]], bth[buf[i++]], '-',
    bth[buf[i++]], bth[buf[i++]], '-',
    bth[buf[i++]], bth[buf[i++]], '-',
    bth[buf[i++]], bth[buf[i++]],
    bth[buf[i++]], bth[buf[i++]],
    bth[buf[i++]], bth[buf[i++]]
  ]).join('');
}

module.exports = bytesToUuid;


/***/ }),

/***/ 747:
/***/ (function(module) {

module.exports = require("fs");

/***/ }),

/***/ 800:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const createQueryFilter_1 = __webpack_require__(657);
exports.update = (config, db) => {
    const table = config.table;
    const query = JSON.parse(config.query);
    const updatePartial = JSON.parse(config.record);
    const operation = config.operation;
    let data = db.readTable(table);
    const queryFilter = createQueryFilter_1.createQueryFilter(query);
    const candidates = data.filter(queryFilter).map(rec => rec._id);
    const recordsToUpdate = operation === 'UPDATEMANY'
        ? candidates
        : candidates.length > 0
            ? [candidates[0]]
            : [];
    data = data.map(rec => recordsToUpdate.includes(rec._id)
        ? Object.assign(Object.assign(Object.assign({}, rec), updatePartial), { __dirty: true }) : rec);
    db.flushTable(table, data);
    return {
        error: null,
        result: {
            updatedCount: recordsToUpdate.length,
            updatedRecordIds: recordsToUpdate
        }
    };
};


/***/ }),

/***/ 826:
/***/ (function(module, __unusedexports, __webpack_require__) {

var rng = __webpack_require__(139);
var bytesToUuid = __webpack_require__(722);

function v4(options, buf, offset) {
  var i = buf && offset || 0;

  if (typeof(options) == 'string') {
    buf = options === 'binary' ? new Array(16) : null;
    options = null;
  }
  options = options || {};

  var rnds = options.random || (options.rng || rng)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;

  // Copy bytes to buffer, if provided
  if (buf) {
    for (var ii = 0; ii < 16; ++ii) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || bytesToUuid(rnds);
}

module.exports = v4;


/***/ }),

/***/ 839:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const init_1 = __webpack_require__(19);
const upsert_1 = __webpack_require__(900);
const find_1 = __webpack_require__(674);
const update_1 = __webpack_require__(800);
const delete_1 = __webpack_require__(211);
const droptable_1 = __webpack_require__(82);
const Operations = {
    INIT: init_1.init,
    DELETEONE: delete_1.deleteRecords,
    DELETEMANY: delete_1.deleteRecords,
    DROPTABLE: droptable_1.drop,
    FINDONE: find_1.find,
    FINDMANY: find_1.find,
    UPSERT: upsert_1.upsert,
    UPDATEMANY: update_1.update,
    UPDATEONE: update_1.update
};
exports.default = Operations;


/***/ }),

/***/ 842:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(__webpack_require__(747));
class DatabaseDriver {
    constructor(basedir) {
        this.dirty = false;
        if (!fs_1.default.existsSync(`./${basedir}`)) {
            fs_1.default.mkdirSync(`./${basedir}`, { recursive: true });
        }
        this.basedir = `./${basedir}`;
    }
    dropTable(tablename) {
        const dir = this.getTableDirectory(tablename);
        if (fs_1.default.existsSync(dir)) {
            fs_1.default.rmdirSync(dir, { recursive: true });
        }
    }
    readTable(tablename) {
        const dir = this.getTableDirectory(tablename);
        if (fs_1.default.existsSync(dir)) {
            const files = fs_1.default.readdirSync(dir);
            const table = files.map((file) => JSON.parse(fs_1.default.readFileSync(`${dir}/${file}`, 'utf8')));
            return table;
        }
        return [];
    }
    flushTable(tablename, tableData) {
        const dir = this.getTableDirectory(tablename);
        if (!fs_1.default.existsSync(dir)) {
            fs_1.default.mkdirSync(dir, { recursive: true });
        }
        for (const record of tableData || []) {
            if (record.__dirty) {
                delete record.__dirty;
                fs_1.default.writeFileSync(`${dir}/${record._id}.json`, JSON.stringify(record, null, 2));
                this.dirty = true;
            }
            if (record.__delete) {
                fs_1.default.unlinkSync(`${dir}/${record._id}.json`);
                this.dirty = true;
            }
        }
    }
    getTableDirectory(tablename) {
        return `${this.basedir}/${tablename}`;
    }
}
exports.DatabaseDriver = DatabaseDriver;


/***/ }),

/***/ 898:
/***/ (function(module, __unusedexports, __webpack_require__) {

var v1 = __webpack_require__(86);
var v4 = __webpack_require__(826);

var uuid = v4;
uuid.v1 = v1;
uuid.v4 = v4;

module.exports = uuid;


/***/ }),

/***/ 900:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = __webpack_require__(898);
const createQueryFilter_1 = __webpack_require__(657);
/**
 * Will insert a new record if no existing match is found.
 * Will match on _id, unless a query is specified - in which it
 * will update the first match, or insert a new record.
 *
 */
exports.upsert = (config, db) => {
    const { table: tablename, record } = config;
    let jsonRecord;
    try {
        jsonRecord = JSON.parse(record);
    }
    catch (e) {
        return {
            error: `Could not parse record to JSON: ${e.message}`,
            result: null
        };
    }
    const query = config.query && config.query !== '' ? JSON.parse(config.query) : undefined;
    const queryFilter = query
        ? createQueryFilter_1.createQueryFilter(query)
        : createQueryFilter_1.createQueryFilter({ _id: jsonRecord._id });
    let table = db.readTable(tablename);
    let newRecord;
    const result = {};
    if (!jsonRecord._id && !query) {
        newRecord = createNewRecord(jsonRecord);
        table.push(newRecord);
    }
    else {
        const existingRecord = table.filter(queryFilter);
        if (existingRecord.length === 0) {
            newRecord = createNewRecord(jsonRecord);
            table.push(newRecord);
            result.new = true;
            result.update = false;
        }
        else {
            newRecord = Object.assign(Object.assign({}, jsonRecord), { _updated: new Date().toString() });
            table = table.map(rec => rec._id === existingRecord[0]._id ? newRecord : rec);
            result.update = true;
            result.new = false;
        }
    }
    db.flushTable(tablename, table);
    return {
        error: null,
        result: newRecord
    };
};
function createNewRecord(jsonRecord) {
    return Object.assign(Object.assign({}, jsonRecord), { _updated: new Date().toString(), _id: uuid_1.v4(), __dirty: true });
}


/***/ })

/******/ });