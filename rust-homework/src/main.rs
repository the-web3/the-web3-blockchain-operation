use std::cmp::Ordering;

// 第一题
fn check_number_type(number :i32) {

    match number.cmp(&0) {
        Ordering::Less => println!("{number} 是负数!"),
        Ordering::Greater => println!("{number} 是正数!"),
        Ordering::Equal =>  println!("{number} 是0️⃣!"),
    }
}

fn loop_to10() {
    let mut i = 0;
    loop {
        i += 1;
        println!("{i}");
        if i >= 10 {
            break;
        }
    }
}

fn printOven() {
    for i in 1..888 {
        if i % 2 == 0 {
            println!("{i}是偶数");
        }
    }
}

// 第二题
fn bubble_sort(mut nums: Vec<i32>, ascend: bool) ->  Vec<i32> {
    let len = nums.len();
    for i in 0..len {
        for j in 0..len-i-1 {
            //     正序
            if ascend && nums[j] > nums[j + 1] {
                nums.swap(j, j + 1);
            } else if !ascend && nums[j] < nums[j + 1] {
                nums.swap(j, j + 1);
            }
        }
    }
    nums
}

// 动态数组中查找
fn find_in_nums(mut nums: Vec<i32>, target: i32) -> (bool, Option<i32>) {
    nums.sort();
    println!("sorted nums is {nums}");

    match nums.iter().position(|&x| x == target) {
        Some(index) => (true, Some(index as i32)),
        None => (false, None)
    }
}

// 第三题
fn fibonacci(n: i32) -> i32 {
    if n <= 1 {
        n
    } else {
        fibonacci(n - 1) + fibonacci(n - 2)
    }
}

// 报错了
// fn fibonacci1(n: i32) -> i32 {
//     let mut fibNumbers = Vec::new();
//     if n <= 1 {
//         n
//     } else {
//         for i in 2..=n {
//             let next_number = fibNumbers[i - 1] + fibNumbers[i - 2];
//             fibNumbers.push(next_number);
//         }
//         fibNumbers[n]
//     }
// }
fn main() {
    // println!("Please input number.");
    // let mut number = String::new();
    // io::stdin()
    //     .read_line(&mut number)
    //     .expect("Failed to read line");
    // println!(" {number}.");

    // check_number_type(number.parse().unwrap());
    check_number_type(4);
    check_number_type(-3);
    check_number_type(0);


    loop_to10();

    // printOven();

    let number = fibonacci(20);
    // let number2 = fibonacci1(20);

    println!("fibonacci结果是{number}");
    // println!("fibonacci1 结果是{number2}");
    // let flag = assert_eq!(number, number2);
    // println!("flag{flag}");

}