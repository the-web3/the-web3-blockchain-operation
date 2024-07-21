const  DAYS_IN_WEEK:i32 = 7;
fn main() {
    println!("Hello, world!");
    let mut a = 10;

    a = 7;
    let a ="asdasuhdouias";
    println!("{}",a);
    let if_a = 1;
    if if_a > 0 {
        println!("是正数");
    }else {
        println!("不是正数");
    }
    let mut loop_a = 1;
    loop {

        loop_a += 1;
        println!("循环次数{}",loop_a);
        if loop_a == 10 {
            break
        }
    }
    //使⽤ for 循环遍历 1 到 888 的数字，并只打印出其中的偶数。
    for i in 1..=888{
       if i % 2 ==0{
           println!("是偶数{}",i);
       }
    }
    //数组排序 定位与正反顺序
    let mut numbers = vec![5, 3, 8, 4, 2];
    let search_value = 4;
    let result = find_element_sorted(&mut numbers, search_value,true);

    match result {
        (found, index) => {
            if found {
                println!("Element {} found at index {:?}", search_value, index);
            } else {
                println!("Element {} was not found", search_value);
            }
        }
    }
//斐波那契
    for i in 0..10 {
        println!("fibonacci_iterative({}) = {}", i, fibonacci_iterative(i));
    }
}




fn bubble_sort(arr: &mut [i32], ascending: bool) -> &[i32] {
    let len = arr.len();
    for i in 0..len {
        for j in 0..len - i - 1 {
            // 根据ascending参数决定排序的方式
            if (arr[j] > arr[j + 1] && ascending) || (arr[j] < arr[j + 1] && !ascending) {
                arr.swap(j, j + 1);
            }
        }
    }
    &arr[..]

    // 注意：由于Rust的所有权规则，这里不能直接返回arr，
    // 因为它可能被修改。如果需要返回一个新数组，可以使用arr.to_owned()，
    // 但这会复制数组。这里我们返回一个对原数组的不可变引用。
}




fn find_element_sorted(arr: &mut [i32], search_value: i32, ascending: bool) -> (bool, Option<usize>) {
    // 首先对数组进行排序
    bubble_sort(arr, ascending); // 假设我们总是进行升序排序

    // 然后使用二分查找算法查找元素
    let mut left = 0;
    let mut right = arr.len() - 1;

    while left <= right {
        let mid = left + (right - left) / 2;

        if arr[mid] == search_value {
            // 如果找到元素，返回存在标志和索引
            return (true, Some(mid));
        } else if arr[mid] < search_value {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    // 如果没有找到元素，返回不存在标志和None
    (false, None)
}



fn fibonacci_iterative(n: u32) -> u64 {
    let mut a = 0;
    let mut b = 1;
    let mut result = 0;

    if n == 0 {
        return a;
    }

    for _ in 1..=n {
        result = a + b;
        a = b;
        b = result;
    }

    result
}

