import { BehaviorSubject, Subject, of } from 'rxjs'
import { map, switchMap, take } from 'rxjs/operators'
import { ipc } from '@/const'
import { editer_setting$ } from '@/subject'
import { mk_uuid } from '@/function/id32'
import { curry_of_some } from '@/util/of-some'

/** 书目列表 */
export const book_li$ = new BehaviorSubject<book_dto[]>([])
export const book_use_id$ = new BehaviorSubject('')
/** 聚焦的书目 */
export const book_use$ = book_li$.pipe(switchMap((li) => book_use_id$.pipe(map((id) => li.find((v) => v.id === id)))))

/** 方便获取当前书的路径, 空为空字符串 */
export function get_cur_book_src() {
    let re = ''
    book_use$.pipe(take(1)).subscribe((b) => {
        re = b?.src ?? ''
    })
    return re
}

function find_book_li(srcs: string[]): book_dto[] {
    const re = ipc().sendSync('load_books', srcs) || []
    return re
}

/** 更新书目列表的简单方法, 调用即更新 */
export function find_book_li_auto() {
    editer_setting$
        .pipe(
            take(1),
            map((v) => v?.shelf.book_list ?? []),
            map(find_book_li),
        )
        .subscribe((li) => {
            console.log('书列表:', li)
            book_li$.next(li)
        })
}

function default_book(): book_dto {
    return {
        id: mk_uuid(),
        name: '',
        src: '',
        cover: '',
        git: false,
    }
}

/** 创建一本新书 */
export const of_book = curry_of_some(default_book())
