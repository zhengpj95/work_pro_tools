"""
把字符串数组解析成数组
如果是number类型的，应该做对应转换
"""

from enum import Flag
import re


def strToList(lab: str):
    stack = []

    while True:
        # print(lab, stack)
        if (not lab):
            break
        if lab[0] == '[':
            stack.append('[')
            lab = lab[1:]
        elif lab[0] == ']':
            smallList = []
            while (len(stack) > 0):
                pop = stack[len(stack)-1]
                if (pop == '['):
                    stack.pop()
                    stack.append(smallList)
                    break
                else:
                    smallList.insert(0, stack.pop())
            lab = lab[1:]
            if lab and lab[0] == ',':
                lab = lab[1:]
        else:
            idx = lab.find(',')
            idx2 = lab.find(']')
            haveSmallList = False
            if ((idx2 > idx and idx == -1) or (idx != -1 and idx2 < idx)):
                idx = idx2
                haveSmallList = True
            stack.append(lab[0:idx].strip())
            if haveSmallList:
                lab = lab[idx:]
            else:
                lab = lab[idx+1:]
    if len(stack) == 1:
        stack = stack.pop()
    # print(stack, len(stack))
    return dealNumberList(stack)


def dealNumberList(array):
    result = []
    for i in array:
        if type(i).__name__ == 'list':
            res = dealNumberList(i)
            result.append(res)
        else:
            if is_number(i):
                if i.find('.') > -1:
                    i = float(i)
                else:
                    i = int(i)
            if i == '':
                result.append(None)
            else:
                result.append(i)
    return result


def is_number(s):
    if not s:
        return False
    value = re.compile(r'^[-+]?[.]?[0-9]+')
    if value.match(s):
        return True
    return False


""" test """

# label = '[1,2,[11,31],33,44,[4,5,6,,  7],123123,43229001111100,10000.10010,"你好中国",["北京","中国","china"]]'
# print(len(label), label.find('['), label.rfind(']'))
# print(label[label.find('[')+1: label.rfind(']')].split(','))
# res = strToList(label)
# print(res)

# print(label.find(']'))
# label = '[1,2,[11,31],33,44,[4,5,6,,  7]]'
# print(re.split(r'[\,\[\]]', label))

# print(is_number('123.123'))
# print(is_number('123.123asd'))
# print(is_number('123'))
# print(is_number('-123.00'))
# print(is_number('+123.0'))
# print(is_number('六'))
