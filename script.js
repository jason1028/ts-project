"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const url = 'https://api.thecatapi.com/v1/images/search';
// button可能为null，如果直接在button:HTMLButtonElement 会报错， 解决方案：加上 | null(联合类型) 或者 用下面断言 as [这是明确告诉ts这是HTMLButtonElement]
// const button = document.querySelector('button') as HTMLButtonElement;
const button = document.querySelector('#test_btn');
const tableBody = document.querySelector('#table-body');
class Cat {
    constructor(id, url, height, width) {
        this.id = id;
        this.url = url;
        this.height = height;
        this.width = width;
    }
}
class WebDispaly {
    // 公共访问  参数类型为catType   返回值为void
    static addData(data) {
        const cat = new Cat(data.id, data.url, data.height, data.width);
        const tableRow = document.createElement('tr');
        tableRow.innerHTML = `
            <td>${cat.id}</td>
            <td><img src="${cat.url}" width="30"/></td>
            <td>${cat.height.toString()}</td>
            <td>${cat.width.toString()}</td>
            <td>${cat.url}</td>
            <td><a href="#">X</a></td>
        `;
        // ? 代表可能为null，如果是null就不会执行.appendChild
        tableBody === null || tableBody === void 0 ? void 0 : tableBody.appendChild(tableRow);
    }
    static deleteData(deleteButton) {
        // 断言
        const td = deleteButton.parentElement;
        // 断言
        const tr = td.parentElement;
        tr.remove();
    }
}
// 获取getJSON 泛型T，返回Promise<T>
function getJSON(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(url);
        // 返回的是promise, 类型为泛型T
        const json = yield response.json();
        return json;
    });
}
// 获取数据
function getData() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // 接口数组CatType[] getJSON是一个泛型
            const json = yield getJSON(url);
            const data = json[0];
            WebDispaly.addData(data);
        }
        catch (err) {
            let message;
            if (err instanceof Error) {
                message = err.message;
            }
            else {
                message = String(err);
            }
            console.error(err);
        }
    });
}
// 注明事件类型<'click'>
button === null || button === void 0 ? void 0 : button.addEventListener('click', getData);
tableBody === null || tableBody === void 0 ? void 0 : tableBody.addEventListener('click', (ev) => {
    WebDispaly.deleteData(ev.target);
});
