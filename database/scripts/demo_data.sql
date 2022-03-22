-- Adminer 4.8.1 MySQL 5.5.5-10.6.5-MariaDB-1:10.6.5+maria~focal dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

SET NAMES utf8mb4;

INSERT INTO `admin` (`id`, `username`, `password`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
('0cab27bc-a935-11ec-baf8-0242ac160002',	'jeanmarc2',	'5898fc860300e228dcd54c0b1045b5fa0dcda502',	'2022-03-21 16:43:01',	'2022-03-21 16:43:10',	NULL);

INSERT INTO `comment` (`id`, `event_id`, `user_id`, `message`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
('56f40716-a938-11ec-baf8-0242ac160002',	'fdb8da9e-a936-11ec-baf8-0242ac160002',	'339768db-a936-11ec-baf8-0242ac160002',	'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis rutrum sapien at quam ultrices condimentum. Aliquam erat volutpat. Phasellus euismod a nibh eu convallis. Phasellus ultrices orci eget lacus maximus auctor. Cras malesuada nisl lorem, et varius felis euismod a. Suspendisse felis mauris, dapibus non tincidunt sed, efficitur vitae lectus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Fusce dolor mi, vulputate at cursus ut, feugiat dictum lectus. Sed sem dui, volutpat vitae consectetur vel, dictum vitae sapien. Suspendisse gravida posuere lorem sed facilisis. Mauris porta ornare vulputate. In tempus nisi eu fringilla aliquam. Integer facilisis risus a ipsum pellentesque, a interdum est iaculis. Curabitur ut magna varius, tempor est bibendum, eleifend ligula.\r\n\r\nSed sem elit, mattis ut rutrum luctus, commodo eu lorem. Proin et metus placerat, aliquam nisl vitae, euismod libero. Nullam eget facilisis turpis. Sed felis magna, scelerisque vel fringilla vel, gravida dignissim mauris. Proin finibus lectus quis justo euismod, a auctor neque suscipit. Nulla sodales finibus enim at rutrum. Vestibulum iaculis eleifend leo, suscipit luctus risus hendrerit malesuada. Ut eleifend vehicula euismod. Duis aliquam nibh diam, eget molestie urna condimentum a.\r\n\r\nSuspendisse eleifend euismod consectetur. Morbi porta erat elit, ac mollis diam accumsan non. Etiam enim felis, elementum a odio ut, pellentesque pharetra augue. Nullam egestas eleifend velit eu pharetra. Aenean placerat ultricies est vitae imperdiet. Vivamus mollis odio in pellentesque posuere. Duis vitae ullamcorper neque, nec dictum turpis. In vehicula viverra lacus, id tincidunt nibh elementum quis. Donec diam augue, bibendum nec orci vel, ullamcorper varius nulla. Pellentesque consectetur ante dui, in commodo orci tempus non. Suspendisse imperdiet sem eu aliquet mattis. Vestibulum molestie, diam luctus pellentesque vestibulum, magna nibh elementum est, sollicitudin venenatis ipsum mauris sed libero.\r\n\r\nSed elementum quis ex quis tempor. Vestibulum tempor augue sit amet finibus sollicitudin. Pellentesque vulputate diam magna, nec sodales lectus egestas quis. Praesent laoreet turpis lorem, nec placerat diam commodo non. In eget ultrices enim. Phasellus luctus massa a augue porta venenatis. Vestibulum vel pellentesque arcu, in rutrum felis. Vestibulum tortor nisi, euismod vitae elementum quis, faucibus eget magna. Nullam aliquet augue ac congue tincidunt.\r\n\r\nMauris aliquam tincidunt est, sit amet tempor sapien dapibus nec. In laoreet maximus sem, quis tempus sem commodo vitae. Pellentesque vehicula dui eu sem molestie semper. Curabitur scelerisque enim a ante varius, et dapibus nisl placerat. In ut ante in felis posuere cursus. Pellentesque vel euismod risus, ultrices fringilla erat. Morbi ut ullamcorper eros, ac elementum odio. Sed a aliquet nisi, at finibus sem. Vivamus mattis rhoncus ullamcorper. In non tempus ante, eu fringilla nisi. Quisque neque eros, interdum nec vehicula eget, pharetra vel turpis. Integer ac nisl ac erat rhoncus viverra id sed est.',	'2022-03-21 16:59:58',	'2022-03-22 09:16:52',	NULL);

INSERT INTO `event` (`id`, `title`, `description`, `address`, `lat`, `long`, `owner_id`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
('fdb8da9e-a936-11ec-baf8-0242ac160002',	'Incroyable fête',	'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut placerat nunc sed odio imperdiet, eget laoreet est condimentum. Fusce fermentum ipsum nibh, mollis tempor mi molestie id. Duis et elementum quam, eget finibus lacus. Phasellus rutrum finibus feugiat. Fusce fringilla urna odio, quis rutrum nisi mattis eget. Donec pulvinar eros id enim tristique porttitor. Sed vehicula porttitor leo ut dignissim. Phasellus non nisl quis enim varius suscipit. Morbi quis urna eu augue hendrerit aliquet ut non nisl. Ut ullamcorper nisl non egestas luctus. Suspendisse ut ligula dolor. Duis posuere auctor nibh, non tempor ipsum mollis ut. Aenean vitae lectus tincidunt, rhoncus neque vel, eleifend ex. Cras vel commodo metus, id finibus mauris.\r\n\r\nEtiam id tincidunt lacus, ac interdum magna. Nulla eget turpis metus. Aenean ac suscipit risus. Donec at fermentum felis. Integer erat quam, ultricies eu tempus eget, dapibus eget sem. Vestibulum sed consequat tortor, vel maximus elit. Nullam nec est rhoncus augue posuere volutpat ut vitae justo. Nam laoreet facilisis arcu, at volutpat ante pulvinar non. Nullam rhoncus lacus eget erat facilisis tincidunt. Fusce aliquam nunc vitae accumsan pretium. Etiam sollicitudin, leo interdum dictum faucibus, enim dui dapibus nulla, vel ultrices ante dolor quis ligula. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec aliquet sollicitudin congue. Aenean vehicula in arcu vel imperdiet. Integer porttitor lorem et leo molestie convallis.\r\n\r\nIn placerat eros diam, id lobortis sapien vulputate ut. Curabitur ut ex eget purus mollis tempus. In in purus vitae ipsum vehicula fermentum in eu dolor. Donec porttitor nisi in sapien blandit congue. Pellentesque quis est felis. Aenean varius sapien at lectus eleifend pretium. Morbi quis lobortis justo. Nullam molestie enim non sapien placerat faucibus. Donec luctus hendrerit sodales. Sed in purus sed enim gravida dapibus ac vel felis. Morbi aliquet pellentesque lectus vel dictum. Phasellus semper tellus imperdiet lorem euismod facilisis. Sed blandit tortor et tempor condimentum.\r\n\r\nSed egestas fermentum nibh, quis blandit ligula laoreet vel. Aliquam efficitur lectus dolor, at feugiat tortor fringilla nec. Fusce eget nunc bibendum, tempus nunc id, mollis ipsum. Duis ultricies urna purus, a tempor lacus tincidunt quis. Aliquam faucibus purus et justo scelerisque ultricies. Morbi luctus dolor convallis, lobortis mauris ut, dapibus nisl. Vestibulum lobortis justo urna, sit amet pellentesque arcu tempor nec. Duis consectetur facilisis quam at commodo. Suspendisse vel magna a sapien venenatis sodales. Nullam eu eleifend eros, at sagittis massa. Sed sed mollis orci, vel posuere elit. Donec pretium purus at dolor hendrerit, vel viverra felis ultrices. Sed eget lacinia arcu. Donec maximus tincidunt commodo. Quisque eu facilisis libero.\r\n\r\nVestibulum eget facilisis elit. Curabitur id orci non sapien cursus semper. Praesent sed sapien augue. Proin pretium, ligula ac pharetra consequat, magna augue faucibus orci, sed feugiat urna neque vel est. Duis nisl lorem, luctus in lacinia hendrerit, semper sit amet quam. Aliquam fringilla lobortis neque. Pellentesque laoreet, sem id interdum ultrices, eros augue ultricies orci, sollicitudin commodo lorem metus et nibh. Ut nec vulputate mauris. Fusce tincidunt convallis dignissim. Vivamus iaculis lorem at sem laoreet, quis egestas ligula faucibus. Pellentesque lacinia eu velit ut mattis. Morbi sit amet aliquam metus. Suspendisse id sapien in velit blandit interdum. Donec sed scelerisque est.',	'3 Rue des Bégonias, Nancy, France',	48.688426,	6.168987,	'339768db-a936-11ec-baf8-0242ac160002',	'2022-03-21 16:50:19',	'2022-03-21 16:50:19',	NULL);

INSERT INTO `user` (`id`, `username`, `password`, `default_event_mail`, `last_connexion`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
('339768db-a936-11ec-baf8-0242ac160002',	'michel43',	'72db0b4596c7cdda864539bff92f8de92b9cae0a',	NULL,	'2022-03-21 16:44:40',	'2022-03-21 16:44:40',	'2022-03-21 16:44:40',	NULL);

INSERT INTO `userevent` (`user_id`, `event_id`, `comeToEvent`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
('339768db-a936-11ec-baf8-0242ac160002',	'fdb8da9e-a936-11ec-baf8-0242ac160002',	1,	'2022-03-21 16:52:56',	'2022-03-22 09:18:52',	NULL);

-- 2022-03-22 09:19:28