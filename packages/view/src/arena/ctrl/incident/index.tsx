// eslint-disable-next-line
import React, { useState, useEffect } from 'react'
import { Route, useRouteMatch } from 'react-router-dom'
import { next_router } from '@/router/router'
import Show from './show'
import Edit from './edit'
import { get_cur_book_src } from '@/source/book'

/** 事件 */
export default function Incident() {
    const { path } = useRouteMatch()

    if (!get_cur_book_src()) {
        next_router('shelf')
        return null
    }

    return (
        <>
            <Route exact path={path} component={Show}></Route>
            <Route exact path={path + '/edit'} component={Edit}></Route>
        </>
    )
}
