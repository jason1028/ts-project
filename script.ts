const url:string = 'https://api.thecatapi.com/v1/images/search';
// button可能为null，如果直接在button:HTMLButtonElement 会报错， 解决方案：加上 | null(联合类型) 或者 用下面断言 as [这是明确告诉ts这是HTMLButtonElement]
// const button = document.querySelector('button') as HTMLButtonElement;
const button: HTMLButtonElement | null = document.querySelector('#test_btn');
const tableBody: HTMLTableElement | null = document.querySelector('#table-body');

 // 接口, 通常为对象进行类型定义
interface CatType {
    id: string;
    url: string;
    height: number;
    width: number;
    test?: boolean; // test?代表 test可有可无, Cat里面就不一定要写test
    start(name: string, age: number): string | null;
}

// 枚举
enum SCORE {
    BAD,
    NG,
    GOOD,
    PERFACE
}

// 枚举字符串
enum SCORE2 {
    BAD=1,
    NG='ng',
    GOOD='good',
    PERFACE='perface'
}

// 泛型 - 复合类型
let classArr: Array<string | null | boolean> = ['aa', null, true];

class Cat implements CatType {
    id: string;
    url: string;
    height: number;
    width: number;

    constructor(id: string, url: string, height: number, width: number) {
        this.id = id;
        this.url = url;
        this.height = height;
        this.width = width;
    }

    start(name: string, age: number): string | null {
        return null;
    }
}

class WebDispaly {
    // 公共访问  参数类型为catType   返回值为void
    public static addData(data: CatType): void {
        const cat: Cat = new Cat(data.id, data.url, data.height, data.width);
        const tableRow: HTMLTableRowElement = document.createElement('tr');
        tableRow.innerHTML = `
            <td>${ cat.id }</td>
            <td><img src="${cat.url}" width="30"/></td>
            <td>${cat.height.toString()}</td>
            <td>${cat.width.toString()}</td>
            <td>${cat.url}</td>
            <td><a href="#">X</a></td>
        `;
        // ? 代表可能为null，如果是null就不会执行.appendChild
        tableBody?.appendChild(tableRow);
    }

    public static deleteData(deleteButton: HTMLAnchorElement): void{
        // 断言
        const td = deleteButton.parentElement as HTMLTableCellElement;
        // 断言
        const tr = td.parentElement as HTMLTableRowElement;
        tr.remove();
    }
}

// 获取getJSON 泛型T，返回Promise<T>
async function getJSON<T> (url: string) : Promise<T> {
    const response: Response = await fetch(url);
    // 返回的是promise, 类型为泛型T
    const json: Promise<T> = await response.json();
    return json;
}

// 获取数据
async function getData(): Promise<void> {
    try {
        // 接口数组CatType[] getJSON是一个泛型
        const json: CatType[] = await getJSON<CatType[]>(url);
        const data: CatType = json[0];
        WebDispaly.addData(data);
    }catch (err: Error | unknown) {
        let message: string;
        if (err instanceof Error) {
            message = err.message;
        } else {
            message = String(err);
        }
        console.error(err);
    }
}

// 注明事件类型<'click'>
button?.addEventListener<'click'>('click', getData);

tableBody?.addEventListener<'click'>('click', (ev: MouseEvent) => {
    // 定义它为<HTMLAnchorElement>类型 或 使用 as
    WebDispaly.deleteData(ev.target as HTMLAnchorElement);
});