#include "../ALGraph/Node.cpp"

// 搜索关键字
bool searchKeywords(string target, string key){
	int len = target.length();
	int n = target.find(key);
	if(len >= n && n >= 0){
		return true;
	}else{
		return false;
	}
}

//快速排序
void quickSort(int start, int end,Node res[]){
	if(start >= end){
		return;
	}
	int temp = res[start].popularity;
	int pLeft = start, pRight = end;
	while(pLeft < pRight){
		while(res[pRight].popularity <= temp && pLeft < pRight){
			pRight--;
		}
		while(res[pLeft].popularity >= temp && pLeft < pRight){
			pLeft++;
		}
		swap(res[pLeft], res[pRight]);
	}
	swap(res[start], res[pLeft]);
	quickSort(start, pLeft - 1, res);
	quickSort(pRight + 1, end, res);
}
