""" 
把字符串数组解析成数组
如果是number类型的，应该做对应转换
"""


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
    return stack


""" test """

# label = '[1,2,[11,31],33,44,[4,5,6,,  7]]'
# print(len(label), label.find('['), label.rfind(']'))
# print(label[label.find('[')+1: label.rfind(']')].split(','))
# res = strToList(label)
# print(res)

# print(label.find(']'))
# label = '[1,2,[11,31],33,44,[4,5,6,,  7]]'
# print(re.split(r'[\,\[\]]', label))
