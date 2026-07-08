export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([]),
	mimeTypes: {},
	_: {
		client: {start:"_app/immutable/entry/start.Co2bMj2v.js",app:"_app/immutable/entry/app.yMcuBr3S.js",imports:["_app/immutable/entry/start.Co2bMj2v.js","_app/immutable/chunks/Kj2r67OJ.js","_app/immutable/chunks/Bk52_Fgx.js","_app/immutable/chunks/C8PMRDiW.js","_app/immutable/entry/app.yMcuBr3S.js","_app/immutable/chunks/Bk52_Fgx.js","_app/immutable/chunks/-L4etScQ.js","_app/immutable/chunks/DkN7b1Df.js","_app/immutable/chunks/C8PMRDiW.js","_app/immutable/chunks/Ci3u9fcl.js","_app/immutable/chunks/B_oqjzEn.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/listen",
				pattern: /^\/listen\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/p/[player_id]",
				pattern: /^\/p\/([^/]+?)\/?$/,
				params: [{"name":"player_id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
