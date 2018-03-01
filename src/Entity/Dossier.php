<?php

namespace GemeenteAmsterdam\FixxxSchuldhulp\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass="GemeenteAmsterdam\FixxxSchuldhulp\Repository\DossierRepository")
 * @ORM\Table
 */
class Dossier
{
    /**
     * @var integer
     * @ORM\Id
     * @ORM\Column(type="integer", nullable=false)
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string
     * @ORM\Column(type="string", length=25, nullable=false)
     */
    private $dossierTemplate;

    /**
     * @var string
     * @ORM\Column(type="string", length=255, nullable=false)
     * @Assert\NotBlank
     * @Assert\Length(min=1, max=255)
     */
    private $clientNaam;

    /**
     * @var string
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Assert\Length(min=0, max=255)
     */
    private $partnerNaam;

    /**
     * @var Schuldhulpbureau
     * @ORM\ManyToOne(targetEntity="Schuldhulpbureau")
     * @ORM\JoinColumn(name="schuldhulpbureau_id", referencedColumnName="id", nullable=false)
     * @Assert\NotBlank
     */
    private $schuldhulpbureau;

    /**
     * @var Team
     * @ORM\ManyToOne(targetEntity="Team")
     * @ORM\JoinColumn(name="team_id", referencedColumnName="id", nullable=false)
     * @Assert\NotBlank
     */
    private $teamGka;

    /**
     * @var string
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Assert\Length(min=0, max=255)
     */
    private $regasNummer;

    /**
     * @var string
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Assert\Length(min=0, max=255)
     */
    private $allegroNummer;

    /**
     * @var Gebruiker
     * @ORM\ManyToOne(targetEntity="Gebruiker")
     * @ORM\JoinColumn(name="aanmaker_id", referencedColumnName="id", nullable=false)
     */
    private $aanmaker;

    /**
     * @var \DateTime
     * @ORM\Column(type="datetime", nullable=false)
     */
    private $aanmaakDatumTijd;

    public function __construct()
    {
        $this->aanmaakDatumTijd = new \DateTime();
    }

    public function getId()
    {
        return $this->id;
    }

    public function getDossierTemplate()
    {
        return $this->dossierTemplate;
    }

    public function getClientNaam()
    {
        return $this->clientNaam;
    }

    public function getPartnerNaam()
    {
        return $this->partnerNaam;
    }

    /**
     * @return \GemeenteAmsterdam\FixxxSchuldhulp\Entity\Schuldhulpbureau
     */
    public function getSchuldhulpbureau()
    {
        return $this->schuldhulpbureau;
    }

    /**
     * @return \GemeenteAmsterdam\FixxxSchuldhulp\Entity\Team
     */
    public function getTeamGka()
    {
        return $this->teamGka;
    }

    public function getRegasNummer()
    {
        return $this->regasNummer;
    }

    public function getAllegroNummer()
    {
        return $this->allegroNummer;
    }

    /**
     * @return \GemeenteAmsterdam\FixxxSchuldhulp\Entity\Gebruiker
     */
    public function getAanmaker()
    {
        return $this->aanmaker;
    }

    /**
     * @return \DateTime
     */
    public function getAanmaakDatumTijd()
    {
        return $this->aanmaakDatumTijd;
    }

    public function setDossierTemplate($dossierTemplate)
    {
        $this->dossierTemplate = $dossierTemplate;
    }

    public function setClientNaam($clientNaam)
    {
        $this->clientNaam = $clientNaam;
    }

    public function setPartnerNaam($partnerNaam)
    {
        $this->partnerNaam = $partnerNaam;
    }

    /**
     * @param Schuldhulpbureau $schuldhulpbureau
     */
    public function setSchuldhulpbureau(Schuldhulpbureau $schuldhulpbureau)
    {
        $this->schuldhulpbureau = $schuldhulpbureau;
    }

    /**
     * @param Team $teamGka
     */
    public function setTeamGka(Team $teamGka)
    {
        $this->teamGka = $teamGka;
    }

    public function setRegasNummer($regasNummer)
    {
        $this->regasNummer = $regasNummer;
    }

    public function setAllegroNummer($allegroNummer)
    {
        $this->allegroNummer = $allegroNummer;
    }

    public function setAanmaker($aanmaker)
    {
        $this->aanmaker = $aanmaker;
    }

    /**
     * @param \DateTime $aanmaakDatumTijd
     */
    public function setAanmaakDatumTijd(\DateTime $aanmaakDatumTijd)
    {
        $this->aanmaakDatumTijd = $aanmaakDatumTijd;
    }

}