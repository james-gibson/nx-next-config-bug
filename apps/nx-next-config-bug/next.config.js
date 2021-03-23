// eslint-disable-next-line @typescript-eslint/no-var-requires
const withNx = require('@nrwl/next/plugins/with-nx');

// Default ~ Not working
// module.exports = withNx({});

// Modified
module.exports = (phase, config, options ) => withNx({});
