-- Получаем аргументы скрипта
local from = ARGV[1]
local to = ARGV[2]
local text = ARGV[3]

-- Формируем JSON сообщения
local message = cjson.encode({from = from, to = to, text = text})

-- Определяем ключ диалога
local dialogKey = "dialog:" .. (from < to and from .. ":" .. to or to .. ":" .. from)

-- Добавляем сообщение в начало списка диалога
redis.call('LPUSH', dialogKey, message)

-- Возвращаем ключ диалога для подтверждения
return dialogKey
