
// New file for handing Chatting

import React from 'react';

import { 
    ApolloClient, 
    InMemoryCache, 
    ApolloProvider,
    useQuery,
    useSubscription,  
    useMutation,
    gql, 
} from "@apollo/client";

// websocket을 쓰려면 아래 내용 추가
import { WebSocketLink } from '@apollo/client/link/ws';
// graphQL 서버가 listening 하고 있는 주소 기재
const link = new WebSocketLink({
    uri: `ws://localhost:4000/`,
    options: {
        reconnect:true
    }
})

// 얘를 import하면 Container 태그를 쓸 수 있음.
import {
    Container,
    Row,
    Col,
    FormInput,
    Button
} from "shards-react"


const GET_MESSAGES = gql `
query {
    messages {
      id
      user
      content
    }
  }
`;

const SUBSCRIPTION_MESSAGES = gql `
subscription {
    messages {
      id
      user
      content
    }
  }
`;


const POST_MESSAGE = gql `
mutation ($user:String!, $content:String!) {
    postMessage (
      user: $user, content: $content )
  }
`

// 메시지를 화면에 표시해 주는 파트
const Messages = ({user}) => {
    // const {data} = useQuery(GET_MESSAGES); //한번만 물어온다.
    // const {data} = useQuery(GET_MESSAGES, { //주기적으로 물어오게 한다. --> 서버 뒤진다.
    //     pollInterval: 500,
    // }); 
    const {data} = useSubscription(SUBSCRIPTION_MESSAGES)

    // 그래서 이걸 subscription을 쓰도록 해야 함. 얘는 websocket을 가져다 쓰는 듯. 

    if(!data) {
        return null;
    }
    
    // return JSON.stringify(data)
    // <> </> 와 같이 빈 것을 넣어도 되나 보지?
    // user는 <Message user="~~">의 user property 에 있는 값이며
    // messageUser는 messages 객체내에 포함된 메시지 송신자 아이디임
    // TODO: map의 기능은 또 뭔가?
    //  - https://aljjabaegi.tistory.com/40
    return (
        <>
            {data.messages.map( ({id, user:messageUser, content}) => (
                <div
                    style={{
                        display: "flex",
                        // ===의 의미는 또 뭔가?
                        justifyContent: user === messageUser? "flex-end" : "flex-start",
                        paddingBottom: "1em",
                    }}
                >
                    {user !== messageUser && (
                        <div
                        style={{
                            height: 50,
                            width: 50,
                            marginRight: "0.5em",
                            border: "2px solid #e5e6ea",
                            borderRadius: 25,
                            textAlign: "center",
                            fontSize: "18pt",
                            paddingTop: 5,
                        }}
                        >
                        {messageUser.slice(0, 2).toUpperCase()}
                        </div>
                    )}
                    <div
                        style = {{
                            background: user === messageUser? "#58bf56": "#e5e6ea",
                            color: user == messageUser? "white" : "black",
                            padding: "1em",
                            borderRadius : "1em",
                            maxWidth : "60%",
                            
                        }}
                    >
                        {content}
                    </div>
                </div>  
            ))}
        </>
    );
  }



const client = new ApolloClient({
    link, // websocket link 만든것을 연결해줌.
    uri: 'http://localhost:4000',
    cache: new InMemoryCache()
})
    


// 메시지 입력창을 그려주는 파트
// user 파라미터에는 로그인한 사용자의 아이디가 들어가면 된다.
// Container로 Wrap을 한다. 왜? TODO: ARABOZA
const Chat = () => {
    
    // State는 어떤.... 저장공간? 여러 페이지를 오갈 수 있는?

    const [state, stateSet] = React.useState({
        user:"Jack",
        content: "",
    })

    // TODO: 이 문법은 또 무엇인고.... 
    // 배열같은데.. 변수도 아니고.... 함수인데.. 
    const [postMessage] = useMutation(POST_MESSAGE);


    const onSend = () => {
        if(state.content.length > 0) {
            // Apollographql에서 사용하는 문법이 그러한 것이니 그냥 따르도록 하여라
            // variables 는 일종의 키워드라고 봐라....
            // 넘겨주는 정보는 state임.
            postMessage({
                variables: state,
            })

        }
        stateSet({
            ... state,
            content: '',
        })

    }


    return (
    <Container>
        <Messages user={state.user}></Messages> 

        {/* 왼쪽에는 아이디, 오른쪽에는 텍스트 입력창, 전송버튼 이 붙어 있는 한 줄을 만들어 준다. */}
        <Row>
            {/* padding을 0로 하면 쫙 붙어버린다. 왼쪽과? */}
            <Col xs={2} style={{ padding: 0}}>
                <FormInput
                    label="User"
                    value={state.user}
                    onChange = {(evt) => stateSet({
                        ... state,
                        user: evt.target.value,
                    })}
                />
            </Col>
            {/* xs 사이즈 * 8개 짜리 */}
            <Col xs={8} >
                <FormInput
                    label="User"
                    value={state.content}
                    onChange = {(evt) => 
                        stateSet({
                        // 워매, 이건 또 뭔 문법이여???
                        ... state,
                        // user: evt.target.value, ==> 요렇게 두면, 입력창에 글을 치면 무조건 user 쪽만 바뀐다.
                        content: evt.target.value,

                        })
                    }
                    onKeyUp={(evt) => {
                        // 엔터키가 눌리면!!
                        if(evt.keyCode === 13 ) {
                            onSend();
                        }
                    }}
                    
                />
            </Col>            
            <Col xs={2} style={ {padding:0} }>
                <Button onClick={() => onSend()}>
                    Send 
                </Button>
            </Col>             
        </Row>
    </Container>    
    );
    // return (<div>CHAT WINDOW </div>)
}


// 다른 파일에서 가져다 쓰려면 아래처럼  export를 해 줘야 한다
// 그런데, ApolloProvider 어쩌구는 갑자기 왜 넣어야하는 걸까? TODO: ARABOZA
// client에 대한 파라미터로 이 Chat.jsx가 가지고 있는 apollo client 객체를 넘겨준다.
export default () => (
    <ApolloProvider client={client}>
        <Chat />
    </ApolloProvider>
)


