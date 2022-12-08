# ts-project
Type Script

## TS的使用场景
> 面向项目: 
- TS-面向解决大型复杂项目，复杂架构以及代码维护场景；
- JS-脚本化语言，用于面向简单页面场景；

> 自主检测:
- TS - 编译期间、主动发现并指出错误；
- JS - 无编译阶段

> 类型检查:
- TS - 强类型
- JS - 弱类型

> 运行流程:
- TS - 依赖编译，编译后转化为JS (tsc)
- JS - 不依赖编译


<br/>

### 一. TS基础类型的写法
* boolean string number undefined null array
```js
    // es
    let isEnabel = false;
    let class = "test";
    let classNum = 2;
    let u = undefined;
    let n = null;
    let classArr = ['basic', 'excute'];

    // ts
    let isEnabel: boolean = true;
    let class: string = "test";
    let classNum: number = 2;
    let u: undefined = undefined;
    let n: null = null;
    // 单纯型数组
    let classArr: string[] = ['basic', 'excute'];
    let classArr: Array<string|null> = ['aa', null];
```

* 枚举
#### 默认索引从0开始，依次递增  中途赋值，按中途赋值为准依次递增
```ts
    // 定义枚举
    enum SCORE {
        BAD,
        NG,
        GOOD = 4,
        PERFACE
    }

    // 自定义内容
    enum SCORE {
        BAD='aa',
        NG='bb',
        GOOD='CC',
        PERFACE='dd'
    }
```

* any、unknown、void、never - 区别？
```ts
    // any - 绕过所有的类型的检查，包含传递、赋值、声明
    let anyValue: any = 123;
    anyValue = "abc";   // 不会报错

    // unknown - 绕过了声明、赋值检查 -> 但不会绕过传递
    let unknownValue: unknown;
    // 不报错
    unknownValue = true;
    unknownValue = 123;
    unknownValue = null;

    // 问题点？
    let value1: unknown = unknownValue; // 0K
    let value2: any = unknownValue;
    let value3: bollean =  unknownValue // 禁止被传毒

    // void - 函数无返回，
    function voidFunction(): void {
        // no return;
    }
    // 定义接收字符串数组，会报错
    const arr: string[] = voidFunction;

    // never - 永不回头(后面代码不会再执行) or 永远error
    function error(msg: string): never {
        throw new Error(msg);
    }
```

* Object / ObjectConstructor / {} 对象
```ts
    // Object - Object.prototype上属性;
    interface Object {
        constructor: Function;
        toString(): string;
        valueOf(): Object;
    } // %接口interface
    
    // ObjectConstructor - 定义了Object本身的属性；
    interface ObjectConstructor {
        readonly prototype: Object;
        getPrototypeOf(o: object): Object;
    }

    interface ObjectC {
        create(o: object | null): any;
    }

    Object.create(obj);  // OK
    Object.create(null); // OK
    Object.create(undefined); // NO

    // {} - 定义空属性
    const obj = {};
    obj.name = 'jason'; // NO
    obj.toString(); // OK
```

### 二、接口(interface)

* 对行为(对象)的一种抽象，具体的行为是由类来实现的。
```ts
    interface Class {
        name: string,
        time: number
    }

    let o: Class  = {
        name: 'jason',
        time: 2
    }

    // 只读 & 任意
    interface Class {
        readonly name: string; // 只读
        time: number
    }

    /**
     * 问题： -const(防止篡改指针地址) 和 ts当中 readonly(防止篡改内容) 区别?
    */
    let arr: number[] = [1, 2, 3, 4, 5, 6];
    let ro: ReadonlyArray<number> = arr;

    ro[0] = 8;          // 下标赋值操作 - NO
    ro.push(10);        // 新增操作 - NO
    ro.length = 100;    // 长度修改 - NO
    arr = ro;           // 覆盖 - NO
    

    // 任意可添加属性
    interface Class {
        readonly name: string;
        time: number;
        // key可以是string, 值可以是any
        [propName: string]: any;
    }
```

### 三、交叉类型 - type &
```ts
    // 合并
    interface A { x: D; }
    interface B { x: E; }
    interface C { x: F; }

    interface D { d: boolean; }
    interface E { e: string; }
    interface F { f: number; }

    type ABC = A & B & C;
    
    // 复合类型，同时包含d,e,f
    let abc: ABC = {
        x: {
            d: false;
            e: 'aaaa',
            f: 10
        }
    }

    /**
     * 问题：合并冲突该怎么解决？
    */
    interface A {
        c: string;
        d: string;
    }
    interface B {
        c: number;
        e: string;
    }
    
    // c合并时候冲突了
    type AB = A & B;
    let ab: AB = {
        d: 'class',
        e: false
    }
    // 合并的c 关系是 且  => never
```

### 四、断言 as（类型声明与转化）

* 编译时作用
```ts
    // 尖括号的形式声明 - 阶段性声明
    let anyValue: any = 'any-value';
    let anyLength: number = (<string>anyValue).length;
    
    // as声明形式
    let anyValue: any = 'any-value';
    let anyLength: number = (anyValue as string).length;

    // 非空判断
    type ClassTime = () => number;
    const start = (classTime: ClassTime | undefined) => {
        let num:<string | null> = classTime!(); // 1、!非空保证  2、具体类型待定
    }
```

### 五、类型守卫 - 保障在语法在规定的范围内，额外的类型确认 / 细分逻辑 type |

* 多态 - 多种状态（多种类型）type |
```ts
    interface Teacher {
        name: string;
        courses: string[];
        score: number;
    }

    interface Student {
        name: string;
        startTime: Date;
        score: string;
    }

    // 组合 |(或) 类型
    type Class = Teacher | Student;
    function startCourse(cls: Class) {
        if("courses" in cls) { 
            // 老师
        } else {
            // 学生
        }

        if(typeof score === 'number') {
            // Teacher
        }

        if(typeof score === 'string') {
            // Student
        }

        if (cls instanceof Teacher) {
            // 老师
        }

        if (cls instanceof Student) {
            // 学生
        }
    }

    // 自定义类型
    const isTeacher = function(cls: Teacher | Student): cls is Teacher {
        return 'Teacher';
    }

    const getName = (cls: Teacher | Student) => {
        if(isTeacher(cls)) {
            return cls.course;
        } else {
            return cls.name;
        }
    }
```

### 六、TS进阶
#### 1. 函数的重载

```ts
    class Class {
        start(name: number, score: number): number;
        start(name: string, score: number): number;
    }
```

#### 2. 泛型（模块支持多种类型的数据，让类型和值一样可以被赋值、变量、传递）

```ts
    // 让调用者来确定当前的类型
    function startClass<T, U>(name: T, score: U): T {
        return name + String;
    }

    function startClass<T, U>(name: T, score: U): string {
        return `${name} + ${score}`;
    }

    function startClass<T, U>(name: T, score: U): T {
        return (name + String(score)) as any as T;
    }

    
    startClass<string, number>('jason', 10);
```

#### 3. 装饰器 - decorator
```ts
    // 启动装饰器
    {
        "experimentalDecorator": true;
    }

    // 类装饰器
    function Test(target: Function): void {
        target.prototype.startClass = function(): void {
            
        }
    }

    @Test
    class Class {
        constructor() {}
    }

    function nameWrapper(target: any, key: string) {
        Object.defineProperty(target, key, {
            // 拦截器
        });
    }

    // 属性装饰器
    class Class {
        constructor() {}

        @nameWrapper
        public name: string;
    }
```
