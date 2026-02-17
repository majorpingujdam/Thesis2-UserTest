var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
var defaultState = {
    trust: 50,
    stress: 20,
    openness: 50,
    lastDialogue: '',
    timestamp: Date.now(),
};
var memoryState = __assign({}, defaultState);
export default defineConfig({
    plugins: [
        react(),
        {
            name: 'mock-api',
            configureServer: function (server) {
                server.middlewares.use('/api/state', function (req, res, next) {
                    if (req.method === 'GET') {
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify(memoryState));
                        return;
                    }
                    if (req.method === 'POST') {
                        var body_1 = '';
                        req.on('data', function (chunk) { body_1 += chunk; });
                        req.on('end', function () {
                            var _a, _b, _c;
                            try {
                                var data = JSON.parse(body_1);
                                memoryState = {
                                    trust: Math.max(0, Math.min(100, (_a = data.trust) !== null && _a !== void 0 ? _a : memoryState.trust)),
                                    stress: Math.max(0, Math.min(100, (_b = data.stress) !== null && _b !== void 0 ? _b : memoryState.stress)),
                                    openness: Math.max(0, Math.min(100, (_c = data.openness) !== null && _c !== void 0 ? _c : memoryState.openness)),
                                    lastDialogue: typeof data.lastDialogue === 'string' ? data.lastDialogue : memoryState.lastDialogue,
                                    timestamp: typeof data.timestamp === 'number' ? data.timestamp : Date.now(),
                                };
                                res.setHeader('Content-Type', 'application/json');
                                res.end(JSON.stringify(memoryState));
                            }
                            catch (_d) {
                                res.statusCode = 400;
                                res.end(JSON.stringify({ error: 'Invalid body' }));
                            }
                        });
                        return;
                    }
                    next();
                });
            },
        },
    ],
});
