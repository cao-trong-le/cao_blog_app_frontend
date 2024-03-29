/* eslint-disable */
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "redux_actions/appActions";
import axiosInstance from "axios_instance/axios_instance";
import { fetchPosts, deleteAllPosts, deleteManyPosts } from "./helper";

const ToolBarComponent = (props) => {
    const [date, setDate] = [props.date, props.setDate]
    const [month, setMonth] = [props.month, props.setMonth]
    const [year, setYear] = [props.year, props.setYear]
    const [query, setQuery] = [props.query, props.setQuery]
    const [sortMethod, setSortMethod] = useState("Sort Desc")


    let tmpState = []
    let _functionStatus = {
        sort: false,
        select_many: false,
        select_all: false, 
        delete_all: false
    }
    const [functionStatus, setFunctionStatus] = useState(_functionStatus)
    const [functionToggle, setFunctionToggle] = useState(false)

    const dispatch = useDispatch()
    const user = useSelector((state) => state.user)
    const app = useSelector((state) => state.app)

    useEffect(() => {
        console.log(functionStatus)

        let function_btns = document.querySelectorAll(".function-btn")

        if (functionToggle) {
            Object.keys(functionStatus).forEach((key, idx) => {
                if (!functionStatus[key]) {
                    function_btns[idx].setAttribute("disabled", "disabled")
                }
            })
        } 
        
        else {
            function_btns.forEach((btn) => {
                btn.removeAttribute("disabled")
            })
        }

    }, [functionStatus, functionToggle])

    const selectAllPosts = () => {
        let post_codes = []
        app.posts.map((post) => {
            post_codes.push(post.post_code)
        })

        dispatch(actions.appendToSelectedList([...post_codes]))
    }


    return (
        <ToolBarComponentWrapper>
            <SearchSection>
                <div className="search-bar-wrapper">
                    <input 
                        type="text" 
                        value={query}
                        onChange={((e) => {setQuery(e.target.value)})}
                        onKeyUp={(e) => {
                            if(e.key === "Enter") {
                                fetchPosts(
                                    user.info.code,
                                    query,
                                    date,
                                    month,
                                    year,
                                    1
                                )
                            }
                        }}
                        placeholder="Search..." />
                </div>

                <input 
                    className="date"
                    type="text"
                    value={date}
                    onChange={((e) => {
                        let val = e.target.value
                        if (val.length <= 2) {
                            if (val == "" || !isNaN(val))
                                setDate(val)
                        }
                    })}
                    placeholder="DD"/>

                <input 
                    className="month"
                    type="text"
                    value={month}
                    onChange={((e) => {
                        let val = e.target.value
                    
                        if (val.length <= 2) {
                            if (parseInt(val) <= 12 || val == "") {
                                if (!isNaN(val))
                                    setMonth(val)
                            } 
                        }
                    })}
                    placeholder="MM"/>

                <input 
                    className="year"
                    type="text"
                    value={year}
                    onChange={((e) => {
                        let val = e.target.value
                    
                        if (val.length <= 4) {
                            if (!isNaN(val))
                                setYear(val) 
                        }
                    })}
                    placeholder="YYYY"/>

                <div className="search-icon-wrapper">
                    <i className="fa fa-search" />
                </div>

            </SearchSection>
            <ToolBarFunctionSection>
                <input 
                    type="button" 
                    data-sorting-method="desc"
                    value={sortMethod}
                    onClick={((e) => {
                        console.log(app.posts.sort((post1, post2) => {
                            return new Date(post2.post_date) - new Date(post1.post_date)
                        }))

                        if (e.target.getAttribute("data-sorting-method") === "desc") {
                            e.target.setAttribute("data-sorting-method", "asc")
                            setSortMethod("Sort Asc")
                            dispatch(actions.setPosts(app.posts.sort((post1, post2) => {
                                return new Date(post2.post_date) - new Date(post1.post_date)
                            })))
                        }
                        
                        else if (e.target.getAttribute("data-sorting-method") === "asc") {
                            e.target.setAttribute("data-sorting-method", "desc")
                            setSortMethod("Sort Desc")
                            dispatch(actions.setPosts(app.posts.sort((post1, post2) => {
                                return new Date(post1.post_date) - new Date(post2.post_date)
                            })))
                        }
                    })}
                    className="function-btn sort-btn" />

                {(() => {
                    if (user.info !== null) {
                        return (
                            <React.Fragment>
                                <input 
                                    type="button" 
                                    className={(() => {
                                        if (functionStatus.select_many) {
                                            return "function-btn cancel-btn"
                                        } else {
                                            return "function-btn select-btn"
                                        }
                                    })()} 
                                    name={functionStatus.select_many ? "cancel" : "select_many"}
                                    value={functionStatus.select_many ? "Cancel" : "Select Many"}
                                    onClick={((e) => {
                                        // console.log(e.target.getAttribute(""))
                                        if (e.target.name == "select_many")
                                            dispatch(actions.setSelecting(true))
                                        else
                                            dispatch(actions.setSelecting(false))
    
                                        setFunctionStatus({
                                            ...functionStatus,
                                            select_many: !functionStatus.select_many
                                        })
    
                                        setFunctionToggle(!functionToggle)
    
                                        if (e.target.getAttribute("name") === "cancel") {
                                            dispatch(actions.resetSelectedList())
                                        } 
                                    })} />
    
                                <input 
                                    type="button" 
                                    className={functionStatus.select_all ? "function-btn cancel-btn" : "function-btn select-all-btn"}
                                    name={functionStatus.select_all ? "cancel" : "select_all"}
                                    value={functionStatus.select_all ? "Cancel" : "Select All"}
                                    onClick={((e) => {
                                        if (e.target.name == "select_all")
                                            dispatch(actions.setSelecting(true))
                                        else
                                            dispatch(actions.setSelecting(false))
                        
                                        setFunctionToggle(!functionToggle)
                                        setFunctionStatus({
                                            ...functionStatus,
                                            select_all: !functionStatus.select_all
                                        })
                                        selectAllPosts()
    
                                        if (e.target.getAttribute("name") === "cancel") {
                                            // console.log("True")
                                            dispatch(actions.resetSelectedList())
                                        } 
                                    })} />
    
                                <input 
                                    type="button" 
                                    className="function-btn delete-all-btn" 
                                    value="Delete All" 
                                    onClick={(() => {
                                        dispatch(actions.removeAllFromPostsList())
                                        deleteAllPosts(user.info.code)
                                    })} />
    
                                <input 
                                    type="button" 
                                    className="delete" 
                                    value="Delete"
                                    hidden={functionToggle ? false : true}
                                    onClick={() => {
                                        deleteManyPosts(user.info.code, [...app.post_selected])
                                    }} />
    
                                <input 
                                    type="button" 
                                    className="hide" 
                                    value="Hide"
                                    hidden={functionToggle ? false : true} />
                            </React.Fragment>
                        )
                    }
                })()}

            </ToolBarFunctionSection>
        </ToolBarComponentWrapper>
    )
}


const ToolBarComponentWrapper = styled.div`
    height: 100px;
    width: 99%;
    border: 1px solid black;
    display: grid;
    grid-template-columns: 100%;
    grid-template-rows: 50% 50%;
    grid-template-areas: 
        "search_by_date"
        "toolbar_function";
    /* padding: 5px; */
    margin-top: 10px;
`;

const ToolBarFunctionsWrapper = styled.div`
    grid-area: functions;
`

const SearchSection = styled.div`
    width: 100%;
    grid-area: search_by_date;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: right;
    align-items: center;
    background-color: green;

    input.sort-by-date,
    input.date,
    input.year,
    input.month {
        border: 1px solid black;
        margin-right: 5px;
        text-align: center;
    }
    
    input.sort-by-date,
    input.date,
    input.month {
        width: 40px;
        height: 40px;
        background-color: azure;
    }

    input.date {
        background-color: aqua;
    }

    input.year {
        width: 50px;
        height: 40px;
        background-color: bisque;
    }

    input.sort-by-date {
        background-color: blueviolet;
    }

    input[type=number]::-webkit-inner-spin-button, 
    input[type=number]::-webkit-outer-spin-button { 
        -webkit-appearance: none; 
        margin: 0; 
    }

    div.search-icon-wrapper{
        height: 40px;
        width: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid black;
        margin-right: 5px;

        i {
            font-size: 14pt;
            /* max-width: 25%; */
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }

    div.search-bar-wrapper {
        /* width: 99%; */
        height: 40px;
        display: flex;
        flex-direction: row;
        justify-content: right;
        align-items: center;

        input {
            width: 85%;
            border: none;
            outline: none;
            /* padding-left: 10px; */
            height: 90%;
            font-size: 12pt;

            /* @media only screen and (max-width: 768px) {
                width: 80%;
            } */

            /* @media only screen and (max-width: 600px) {
                width: 0px;
            } */
        }
    }
`;

const ToolBarFunctionSection = styled.div`
    grid-area: toolbar_function;
    height: 100%;
    width: 100%;
    background-color: firebrick;
    display: flex;
    justify-content: right;
    align-items: center;

    /* @media only screen and (max-width: 768px) {
        width: 200px;
    }

    @media only screen and (max-width: 600px) {
        margin-top: 5px;
        width: 100%;
    } */

    /* div.function-toggle {
        position: absolute;
    } */

    div.delete-functions {
        display: flex;
        flex-direction: row;

        input[type="button"] {
            width: fit-content;
        }
    }
`;


export { ToolBarComponent }