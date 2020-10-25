import {
  applyMiddleware,
  createServer,
  createTabs,
  defaults,
  ServerOptions,
} from '../server';
import {wallet} from '../variables';

jest.mock('apollo-server-express', () => ({
  ApolloServer: jest.fn(),
}));
jest.mock('express', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const ApolloServerMock: jest.Mock = jest.requireMock('apollo-server-express')
  .ApolloServer;
const expressMock: jest.Mock = jest.requireMock('express').default;

describe('defaults', () => {
  it('has a default path', () => {
    expect(defaults).toMatchObject({path: '/graphql'});
  });
});

describe('createTabs()', () => {
  const variables = JSON.stringify(wallet, null, 2);

  it('creates 2 tabs by default', () => {
    expect(createTabs()).toHaveLength(2);
  });

  it('creates 3 tabs if the minter flag is set', () => {
    expect(createTabs({minter: true})).toHaveLength(3);
  });

  it('uses the provided endpoint for each tab', () => {
    const endpoint = '/test';
    const tabs = createTabs({endpoint});

    expect(tabs.map(({endpoint}) => endpoint)).toStrictEqual(
      tabs.map(() => endpoint),
    );
  });

  it('includes the wallet variables', () => {
    const tabs = createTabs();

    expect(tabs.map(({variables}) => variables)).toStrictEqual(
      tabs.map(() => variables),
    );
  });

  it('creates a test query by default', () => {
    expect(createTabs()).toContainEqual(
      expect.objectContaining({name: 'Libra Test Query'}),
    );
  });

  it('creates a seed creator mutation by default', () => {
    expect(createTabs()).toContainEqual(
      expect.objectContaining({name: 'Libra Seed Creator'}),
    );
  });

  it('creates a minter mutation if the minter flag is set', () => {
    expect(createTabs({minter: true})).toContainEqual(
      expect.objectContaining({name: 'Libra Minter'}),
    );
  });
});

describe('createServer()', () => {
  afterEach(() => {
    ApolloServerMock.mockRestore();
  });

  it('creates an apollo server with the provided schema', () => {
    const schema: any = {};

    createServer(schema);

    expect(ApolloServerMock).toHaveBeenCalledWith(
      expect.objectContaining({schema}),
    );
  });

  it('creates an apollo server with the provided options', () => {
    const config: ServerOptions['config'] = {debug: true};
    const context: ServerOptions['context'] = {};
    const options: ServerOptions = {
      config,
      context,
    };

    createServer({} as any, options);

    expect(ApolloServerMock).toHaveBeenCalledWith(
      expect.objectContaining({...config, context}),
    );
  });
});

describe('applyMiddleware()', () => {
  afterEach(() => {
    expressMock.mockRestore();
  });

  it('calls applyMiddleware on the server using the server graphqlPath', () => {
    const applyMiddlewareMock = jest.fn();
    const path = '/test';
    const app: any = {};
    const server: any = {
      applyMiddleware: applyMiddlewareMock,
      graphqlPath: path,
    };

    applyMiddleware(server, {app});

    expect(applyMiddlewareMock).toHaveBeenCalledWith({app, path});
  });

  it('returns the app', () => {
    const app: any = {};
    const server: any = {applyMiddleware: () => {}, graphqlPath: '/test'};

    expect(applyMiddleware(server, {app})).toBe(app);
  });

  it('creates an app if not provided', () => {
    const app: any = {};
    const server: any = {applyMiddleware: () => {}, graphqlPath: '/test'};
    expressMock.mockReturnValue(app);

    expect(applyMiddleware(server)).toBe(app);
  });
});
