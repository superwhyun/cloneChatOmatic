
const { 
    GraphQLServer,
    PubSub
} = require('graphql-yoga')

const messages = [];


//모든 GraphQL은 type(일종의 스키마)을 필요로 한다.
//  - 느낌표는 mandatory
//  - ID라는 타입이 있는 모양이다.
//Mutation은 REST에서 POST와 유사한 것임
//  - 아래의 Mutation에서 postMessage라는 건 임의로 이 코드에서 만든 것.
//  - 즉, 아무거나 니 맘대로 만들어도 된다는 말.

// 이 definition(graphQL 언어로 작성된)은 graphQL 서버로 전달된다. 
const typeDefs = `
    type Message {
        id: ID!
        user: String!
        content: String!
    }

    type Query {
        messages: [Message!]

    }

    type Mutation {
        postMessage(user: String!, content: String!): ID!

    }

    type Subscription {
        messages: [Message!]

    }
`

const subscribers=[];

// onMessageUpdates 함수를 만들고, 얘는 callback으로 사용되도록 함. 
// 즉, argument로 function을 넘기는 거임.
// 그리고 subscribers 배열에 박아버림.
const onMessageUpdates= (fn) => subscribers.push(fn)

const resolvers = {
    Query: {
        messages: () => messages,
    },
    Mutation: {
        postMessage: (parent, {user, content}) => {
            const id = messages.length;
            messages.push({
                id,
                user,
                content,
            })
            // subscribers 배열에 있는 모든 요소에 대해 전송을 수행
            // 화살표 함수 표현(arrow function expression)은 function 표현에 비해 구문이 짧고  
            // 자신의 this, arguments, super 또는 new.target을 바인딩 하지 않습니다. 
            // 화살표 함수는 항상 익명입니다. 이  함수 표현은 메소드 함수가 아닌 곳에 가장 적합합니다. 
            // 그래서 생성자로서 사용할 수 없습니다.
            // https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Functions/%EC%95%A0%EB%A1%9C%EC%9A%B0_%ED%8E%91%EC%85%98
            subscribers.forEach((fn)=>fn());
            return id;
        }
    },
    Subscription: {
        // messages에 대한 subscription에 대한 동작 규정
        messages: {
            // subscribe는..
            subscribe: (parent, args, {pubsub}) => {
                // 랜덤 채널을 만듬.
                const channel = Math.random().toString(36).slice(2,15);

                // onMessageUpdates로 넘길 익명함수를 하나 만든다.
                // 걔가 하는 일은 특정 채널에 messages 의 내용을 publish 한다.
                onMessageUpdates(() => pubsub.publish(channel, {messages}));

                // 해당 채널에 대한 publish timeout은 0으로 지정한다.
                // 즉, 바로 쏜다.
                setTimeout(() => pubsub.publish(channel, {messages}),0);

                // 쉬지말고 바로 channel에 걸린 동작을 진행해라!?
                // TODO : 알아보자.
                return pubsub.asyncIterator(channel);

            }
        }      
    }
}


// port에 값이 없으면 디폴트로 4000번을 읽어들인다.  
const pubsub = new PubSub()
const server = new GraphQLServer({ typeDefs, resolvers, context: {pubsub}});
server.start(({port}) => {
    console.log(`Server listning on http://localhost:${port}/`);
})